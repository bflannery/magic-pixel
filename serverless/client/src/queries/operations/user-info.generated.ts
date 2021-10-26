import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type UserInfoQueryVariables = Types.Exact<{ [key: string]: never }>

export type UserInfoQuery = {
  __typename: 'Query'
  whoami?:
    | {
        __typename: 'UserType'
        id: number
        email: string
        account?: { __typename: 'AccountType'; id: number; name: string } | null | undefined
        roles?: Array<{ __typename: 'RoleType'; id: string; name: string }> | null | undefined
        preferences: { __typename: 'UserPreferences'; id: string }
      }
    | null
    | undefined
}

export const UserInfoDocument = gql`
  query UserInfo {
    whoami {
      id
      email
      account {
        id
        name
      }
      roles {
        id
        name
      }
      preferences @client {
        id
      }
    }
  }
`

/**
 * __useUserInfoQuery__
 *
 * To run a query within a React component, call `useUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<UserInfoQuery, UserInfoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<UserInfoQuery, UserInfoQueryVariables>(UserInfoDocument, options)
}
export function useUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserInfoQuery, UserInfoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<UserInfoQuery, UserInfoQueryVariables>(UserInfoDocument, options)
}
export type UserInfoQueryHookResult = ReturnType<typeof useUserInfoQuery>
export type UserInfoLazyQueryHookResult = ReturnType<typeof useUserInfoLazyQuery>
export type UserInfoQueryResult = Apollo.QueryResult<UserInfoQuery, UserInfoQueryVariables>
