import * as Types from '../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type SignupAccountMutationVariables = Types.Exact<{
  name: Types.Scalars['String']
  industry?: Types.Maybe<Types.Scalars['String']>
  title?: Types.Maybe<Types.Scalars['String']>
}>

export type SignupAccountMutation = {
  __typename: 'Mutations'
  createAccount?:
    | {
        __typename: 'CreateAccount'
        ok?: boolean | null | undefined
        account?: { __typename: 'AccountType'; id: string; name?: string | null | undefined } | null | undefined
      }
    | null
    | undefined
}

export const SignupAccountDocument = gql`
  mutation SignupAccount($name: String!, $industry: String, $title: String) {
    createAccount(name: $name, industry: $industry, title: $title) {
      ok
      account {
        id
        name
      }
    }
  }
`
export type SignupAccountMutationFn = Apollo.MutationFunction<SignupAccountMutation, SignupAccountMutationVariables>

/**
 * __useSignupAccountMutation__
 *
 * To run a mutation, you first call `useSignupAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupAccountMutation, { data, loading, error }] = useSignupAccountMutation({
 *   variables: {
 *      name: // value for 'name'
 *      industry: // value for 'industry'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useSignupAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<SignupAccountMutation, SignupAccountMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignupAccountMutation, SignupAccountMutationVariables>(SignupAccountDocument, options)
}
export type SignupAccountMutationHookResult = ReturnType<typeof useSignupAccountMutation>
export type SignupAccountMutationResult = Apollo.MutationResult<SignupAccountMutation>
export type SignupAccountMutationOptions = Apollo.BaseMutationOptions<
  SignupAccountMutation,
  SignupAccountMutationVariables
>
