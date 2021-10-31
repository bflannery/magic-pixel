import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type UserPreferencesQueryVariables = Types.Exact<{ [key: string]: never }>

export type UserPreferencesQuery = {
  __typename: 'Query'
  whoami?:
    | { __typename: 'UserType'; id: string; preferences: { __typename: 'UserPreferences'; id: string } }
    | null
    | undefined
}

export const UserPreferencesDocument = gql`
  query UserPreferences {
    whoami {
      id
      preferences @client {
        id
      }
    }
  }
`

/**
 * __useUserPreferencesQuery__
 *
 * To run a query within a React component, call `useUserPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserPreferencesQuery(
  baseOptions?: Apollo.QueryHookOptions<UserPreferencesQuery, UserPreferencesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, options)
}
export function useUserPreferencesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserPreferencesQuery, UserPreferencesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, options)
}
export type UserPreferencesQueryHookResult = ReturnType<typeof useUserPreferencesQuery>
export type UserPreferencesLazyQueryHookResult = ReturnType<typeof useUserPreferencesLazyQuery>
export type UserPreferencesQueryResult = Apollo.QueryResult<UserPreferencesQuery, UserPreferencesQueryVariables>
