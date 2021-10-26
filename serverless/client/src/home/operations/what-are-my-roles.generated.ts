import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type WhatAreMyRolesQueryVariables = Types.Exact<{ [key: string]: never }>

export type WhatAreMyRolesQuery = {
  __typename: 'Query'
  whoami?:
    | {
        __typename: 'UserType'
        id: number
        roles?: Array<{ __typename: 'RoleType'; id: string; name: string }> | null | undefined
        account?: { __typename: 'AccountType'; id: number } | null | undefined
      }
    | null
    | undefined
}

export const WhatAreMyRolesDocument = gql`
  query WhatAreMyRoles {
    whoami {
      id
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
 * __useWhatAreMyRolesQuery__
 *
 * To run a query within a React component, call `useWhatAreMyRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhatAreMyRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhatAreMyRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useWhatAreMyRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<WhatAreMyRolesQuery, WhatAreMyRolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<WhatAreMyRolesQuery, WhatAreMyRolesQueryVariables>(WhatAreMyRolesDocument, options)
}
export function useWhatAreMyRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<WhatAreMyRolesQuery, WhatAreMyRolesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<WhatAreMyRolesQuery, WhatAreMyRolesQueryVariables>(WhatAreMyRolesDocument, options)
}
export type WhatAreMyRolesQueryHookResult = ReturnType<typeof useWhatAreMyRolesQuery>
export type WhatAreMyRolesLazyQueryHookResult = ReturnType<typeof useWhatAreMyRolesLazyQuery>
export type WhatAreMyRolesQueryResult = Apollo.QueryResult<WhatAreMyRolesQuery, WhatAreMyRolesQueryVariables>
