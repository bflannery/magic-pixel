import * as Types from '../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type DeleteUserMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']
}>

export type DeleteUserMutation = {
  __typename: 'Mutations'
  deleteUser?:
    | {
        __typename: 'DeleteUser'
        ok?: boolean | null | undefined
        user?: { __typename: 'UserType'; id: string } | null | undefined
      }
    | null
    | undefined
}

export const DeleteUserDocument = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      ok
      user {
        id
      }
    }
  }
`
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options)
}
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>
