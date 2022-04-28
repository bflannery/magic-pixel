import * as Types from '../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type CreateUserMutationVariables = Types.Exact<{
  email: Types.Scalars['String']
  accountId: Types.Scalars['ID']
  roles?: Types.Maybe<Array<Types.UserRoleType> | Types.UserRoleType>
}>

export type CreateUserMutation = {
  __typename: 'Mutations'
  createUser?:
    | {
        __typename: 'CreateUser'
        ok?: boolean | null | undefined
        user?:
          | {
              __typename: 'UserType'
              id: string
              email: string
              account: {
                __typename: 'AccountType'
                id: string
                name?: string | null | undefined
                users?: Array<{ __typename: 'UserType'; id: string }> | null | undefined
              }
              roles: Array<{ __typename: 'RoleType'; id: string; name: string }>
            }
          | null
          | undefined
      }
    | null
    | undefined
}

export const CreateUserDocument = gql`
  mutation CreateUser($email: String!, $accountId: ID!, $roles: [UserRoleType!]) {
    createUser(email: $email, accountId: $accountId, roles: $roles) {
      ok
      user {
        id
        email
        account {
          id
          name
          users {
            id
          }
        }
        roles {
          id
          name
        }
      }
    }
  }
`
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      accountId: // value for 'accountId'
 *      roles: // value for 'roles'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options)
}
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>
