import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type CurrentUserInfoQueryVariables = Types.Exact<{ [key: string]: never }>

export type CurrentUserInfoQuery = {
  __typename: 'Query'
  whoami?:
    | { __typename: 'UserType'; id: string; email: string; account: { __typename: 'AccountType'; id: string } }
    | null
    | undefined
}

export const CurrentUserInfoDocument = gql`
  query CurrentUserInfo {
    whoami {
      id
      email
      account {
        id
      }
    }
  }
`

/**
 * __useCurrentUserInfoQuery__
 *
 * To run a query within a React component, call `useCurrentUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentUserInfoQuery, CurrentUserInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CurrentUserInfoQuery, CurrentUserInfoQueryVariables>(CurrentUserInfoDocument, options)
}
export function useCurrentUserInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserInfoQuery, CurrentUserInfoQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CurrentUserInfoQuery, CurrentUserInfoQueryVariables>(CurrentUserInfoDocument, options)
}
export type CurrentUserInfoQueryHookResult = ReturnType<typeof useCurrentUserInfoQuery>
export type CurrentUserInfoLazyQueryHookResult = ReturnType<typeof useCurrentUserInfoLazyQuery>
export type CurrentUserInfoQueryResult = Apollo.QueryResult<CurrentUserInfoQuery, CurrentUserInfoQueryVariables>
