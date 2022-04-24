import * as Types from '../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type UpdateUserMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']
  roles?: Types.Maybe<Array<Types.UserRoleType> | Types.UserRoleType>
}>

export type UpdateUserMutation = {
  __typename: 'Mutations'
  updateUser?:
    | {
        __typename: 'UpdateUser'
        ok?: boolean | null | undefined
        user?:
          | {
              __typename: 'UserType'
              id: string
              email: string
              account: { __typename: 'AccountType'; id: string; name?: string | null | undefined }
              roles: Array<{ __typename: 'RoleType'; id: string; name: string }>
            }
          | null
          | undefined
      }
    | null
    | undefined
}

export const UpdateUserDocument = gql`
  mutation UpdateUser($userId: ID!, $roles: [UserRoleType!]) {
    updateUser(userId: $userId, roles: $roles) {
      ok
      user {
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
      }
    }
  }
`
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      roles: // value for 'roles'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options)
}
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>
