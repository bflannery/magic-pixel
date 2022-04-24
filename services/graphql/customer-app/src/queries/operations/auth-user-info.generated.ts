import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type AuthUserInfoQueryVariables = Types.Exact<{ [key: string]: never }>

export type AuthUserInfoQuery = {
  __typename: 'Query'
  whoami?:
    | {
        __typename: 'UserType'
        id: string
        email: string
        roles: Array<{ __typename: 'RoleType'; id: string; name: string }>
        account: { __typename: 'AccountType'; id: string }
      }
    | null
    | undefined
}

export const AuthUserInfoDocument = gql`
  query AuthUserInfo {
    whoami {
      id
      email
      roles {
        id
        name
      }
      account {
        id
      }
    }
  }
`

/**
 * __useAuthUserInfoQuery__
 *
 * To run a query within a React component, call `useAuthUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useAuthUserInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<AuthUserInfoQuery, AuthUserInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AuthUserInfoQuery, AuthUserInfoQueryVariables>(AuthUserInfoDocument, options)
}
export function useAuthUserInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AuthUserInfoQuery, AuthUserInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AuthUserInfoQuery, AuthUserInfoQueryVariables>(AuthUserInfoDocument, options)
}
export type AuthUserInfoQueryHookResult = ReturnType<typeof useAuthUserInfoQuery>
export type AuthUserInfoLazyQueryHookResult = ReturnType<typeof useAuthUserInfoLazyQuery>
export type AuthUserInfoQueryResult = Apollo.QueryResult<AuthUserInfoQuery, AuthUserInfoQueryVariables>
