import * as Types from '../../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type AccountQueryVariables = Types.Exact<{
  accountId: Types.Scalars['ID']
}>

export type AccountQuery = {
  __typename: 'Query'
  account?:
    | {
        __typename: 'AccountType'
        id: string
        name?: string | null | undefined
        embedScript?: string | null | undefined
      }
    | null
    | undefined
}

export const AccountDocument = gql`
  query Account($accountId: ID!) {
    account(id: $accountId) {
      id
      name
      embedScript
    }
  }
`

/**
 * __useAccountQuery__
 *
 * To run a query within a React component, call `useAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useAccountQuery(baseOptions: Apollo.QueryHookOptions<AccountQuery, AccountQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options)
}
export function useAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountQuery, AccountQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options)
}
export type AccountQueryHookResult = ReturnType<typeof useAccountQuery>
export type AccountLazyQueryHookResult = ReturnType<typeof useAccountLazyQuery>
export type AccountQueryResult = Apollo.QueryResult<AccountQuery, AccountQueryVariables>
