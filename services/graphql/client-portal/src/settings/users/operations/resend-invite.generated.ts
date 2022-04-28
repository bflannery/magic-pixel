import * as Types from '../../../gql-global'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type ResendUserInviteMutationVariables = Types.Exact<{
  userId: Types.Scalars['ID']
}>

export type ResendUserInviteMutation = {
  __typename: 'Mutations'
  resendUserInvite?: { __typename: 'ResendUserInvite'; ok?: boolean | null | undefined } | null | undefined
}

export const ResendUserInviteDocument = gql`
  mutation ResendUserInvite($userId: ID!) {
    resendUserInvite(userId: $userId) {
      ok
    }
  }
`
export type ResendUserInviteMutationFn = Apollo.MutationFunction<
  ResendUserInviteMutation,
  ResendUserInviteMutationVariables
>

/**
 * __useResendUserInviteMutation__
 *
 * To run a mutation, you first call `useResendUserInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendUserInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendUserInviteMutation, { data, loading, error }] = useResendUserInviteMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useResendUserInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<ResendUserInviteMutation, ResendUserInviteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResendUserInviteMutation, ResendUserInviteMutationVariables>(
    ResendUserInviteDocument,
    options,
  )
}
export type ResendUserInviteMutationHookResult = ReturnType<typeof useResendUserInviteMutation>
export type ResendUserInviteMutationResult = Apollo.MutationResult<ResendUserInviteMutation>
export type ResendUserInviteMutationOptions = Apollo.BaseMutationOptions<
  ResendUserInviteMutation,
  ResendUserInviteMutationVariables
>
