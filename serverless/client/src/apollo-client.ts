import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  FieldFunctionOptions,
  FieldPolicy,
  NormalizedCacheObject,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { ApolloLink } from '@apollo/client/link/core'
import { withScalars } from 'apollo-link-scalars'
import { format, parseISO, parse } from 'date-fns'
import introspectionResult from './introspection.json'
import fragments from './fragments.json'
import { buildClientSchema, IntrospectionQuery } from 'graphql'
import { UserPreferencesDocument, UserPreferencesQuery } from './queries/operations/user-prefs.generated'
import { UserPreferences, UserType } from './gql-global'
// import produce from 'immer'
import { KeyArgsFunction } from '@apollo/client/cache/inmemory/policies'
import { LOGIN_ROUTE } from './auth/routes'

const USER_PREF_KEY = 'userpref'

// type GqlContext = { cache: InMemoryCache }

const dateFormat = 'yyyy-MM-dd'
const typesMap = {
  Date: {
    serialize: (parsed: Date | string | null) => {
      if (!parsed) return null
      if (typeof parsed === 'string') return parsed
      return format(parsed, dateFormat)
    },
    parseValue: (raw?: string) => raw && parse(raw, dateFormat, new Date()),
  },
  DateTime: {
    serialize: (parsed: Date | string | null) => {
      if (!parsed) return null
      if (typeof parsed === 'string') return parsed
      return parsed.toISOString()
    },
    parseValue: (raw?: string) => {
      if (!raw) {
        return raw
      }
      if (!raw.match(/T.+([+-][\d:]+|[Z])$/)) {
        raw = `${raw}Z`
      }
      return parseISO(raw)
    },
  },
}

const schema = buildClientSchema(introspectionResult as unknown as IntrospectionQuery)

// function updateUserPref<K extends keyof UserPreferences>(
//   pref: K,
//   value: UserPreferences[K],
//   context: GqlContext,
// ): UserPreferences[K] | null {
//   const data = context.cache.readQuery<UserPreferencesQuery>({
//     query: UserPreferencesDocument,
//   })
//   if (data && data.whoami) {
//     const { whoami } = data
//     if (whoami.preferences[pref] === value) {
//       return value
//     }
//     const newData = produce(data, (draft: any) => {
//       if (!draft.whoami) {
//         return draft
//       }
//       draft.whoami.preferences[pref] = value
//       return draft
//     })
//     context.cache.writeQuery<UserPreferencesQuery>({
//       query: UserPreferencesDocument,
//       data: newData,
//     })
//     return value
//   }
//   return null
// }

const resolvers = {
  UserType: {
    preferences(user: UserType): UserPreferences {
      const neededValues: Pick<UserPreferences, '__typename' | 'id'> = {
        __typename: 'UserPreferences',
        id: user.id.toString(),
      }
      const prefsString = localStorage.getItem(USER_PREF_KEY)
      if (prefsString) {
        const json = JSON.parse(prefsString)
        const storedPrefs = json as UserPreferences
        if (storedPrefs.id === user.id.toString()) {
          return {
            ...neededValues,
            ...storedPrefs,
          }
        }
      }
      return neededValues
    },
  },
  Mutation: {},
}

type PagedType =
  | {
      cursor?: string | null
      results?: Array<unknown> | null
    }
  | null
  | undefined

function pagedFieldPolicy(keyArgs: string[]): FieldPolicy {
  return {
    keyArgs(args: Record<string, unknown> | null): ReturnType<KeyArgsFunction> {
      return args ? keyArgs.filter((a) => a in args) : undefined
    },
    merge(
      existing: PagedType,
      incoming: PagedType,
      { args, fieldName }: FieldFunctionOptions<{ cursor?: string }>,
    ): PagedType {
      if (!incoming || !existing) return incoming
      // no cursor, not looking for next page, replace fields instead
      if (!args?.cursor) {
        return {
          ...existing,
          ...incoming,
        }
      }
      // strangeness is happening, incoming is not
      // next set, so we dont know what to do with it
      if (existing.cursor !== args.cursor && incoming.results !== undefined) {
        throw new Error(
          `Could not merge paged data for ${fieldName}. Current cursor in cache is not same as cursor arg.`,
        )
      }
      return {
        ...existing,
        ...incoming,
        results: (existing.results || []).concat(incoming.results),
      }
    },
  }
}

export const cache = new InMemoryCache({
  possibleTypes: fragments.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        accounts: pagedFieldPolicy(['where']),
      },
    },
    AccountType: {
      fields: {
        labels: pagedFieldPolicy(['sortBy', 'sortDirection', 'where']),
        segments: pagedFieldPolicy(['sortBy', 'sortDirection', 'where']),
      },
    },
  },
})

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`,
  credentials: 'include',
})

interface getTokenOptions {
  audience?: string
  scope?: string
}

let client: ApolloClient<NormalizedCacheObject> | null = null

export default function createClient(
  getToken: (options: getTokenOptions) => Promise<string>,
): ApolloClient<NormalizedCacheObject> {
  if (client) {
    return client
  }
  const authLink = setContext(async (_, { headers }) => {
    const auth0ApiUrl = process.env.REACT_APP_AUTH0_API_URL
    const token = await getToken({
      audience: auth0ApiUrl,
      scope: 'read:current_user',
    })

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          for (const err of graphQLErrors) {
            // handle errors differently based on its error code
            switch (err && err.extensions && err.extensions.code) {
              case 'UNAUTHENTICATED':
                window.location.href = LOGIN_ROUTE.path
            }
          }
        }
      }),
      withScalars({
        schema,
        typesMap,
      }),
      authLink.concat(httpLink),
    ]),
    cache,
    resolvers,
  })

  apolloClient
    .watchQuery<UserPreferencesQuery>({ query: UserPreferencesDocument, fetchPolicy: 'cache-only' })
    .subscribe((i) => {
      if (i.data?.whoami?.preferences) {
        localStorage.setItem(USER_PREF_KEY, JSON.stringify(i.data.whoami.preferences))
      }
    })
  client = apolloClient
  return apolloClient
}
