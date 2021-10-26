import * as Types from '../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type AccountUsersQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID']
}>

export type AccountUsersQuery = {
  __typename: 'Query'
  account?:
    | {
        __typename: 'AccountType'
        id: number
        name: string
        users?:
          | Array<{
              __typename: 'UserType'
              id: number
              email: string
              createdAt: Date
              lastLoginAt?: Date | null | undefined
              roles?: Array<{ __typename: 'RoleType'; id: string; name: string }> | null | undefined
            }>
          | null
          | undefined
      }
    | null
    | undefined
}

export const AccountUsersDocument = gql`
  query AccountUsers($accountId: ID!) {
    account(id: $accountId) {
      id
      name
      users {
        id
        email
        createdAt
        roles {
          id
          name
        }
        lastLoginAt
      }
    }
  }
`

/**
 * __useAccountUsersQuery__
 *
 * To run a query within a React component, call `useAccountUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountUsersQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useAccountUsersQuery(
  baseOptions: Apollo.QueryHookOptions<AccountUsersQuery, AccountUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AccountUsersQuery, AccountUsersQueryVariables>(AccountUsersDocument, options)
}
export function useAccountUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<AccountUsersQuery, AccountUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AccountUsersQuery, AccountUsersQueryVariables>(AccountUsersDocument, options)
}
export type AccountUsersQueryHookResult = ReturnType<typeof useAccountUsersQuery>
export type AccountUsersLazyQueryHookResult = ReturnType<typeof useAccountUsersLazyQuery>
export type AccountUsersQueryResult = Apollo.QueryResult<AccountUsersQuery, AccountUsersQueryVariables>
