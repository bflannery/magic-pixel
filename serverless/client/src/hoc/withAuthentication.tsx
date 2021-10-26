import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Redirect } from 'react-router-dom'
import { useUserInfoQuery } from '../queries/operations/user-info.generated'

type InnerComponentFactory<WrappedComponentProps> = (
  comp: React.ComponentType<WrappedComponentProps>,
) => React.ComponentType<WrappedComponentProps>

export default function withAuthentication<WrappedComponentProps>(): InnerComponentFactory<WrappedComponentProps> {
  return (Comp) => {
    const WrappedComponent: React.FC<WrappedComponentProps> = (props) => {
      const { user, isLoading, isAuthenticated } = useAuth0()
      const { data: userInfo, loading: userInfoLoading } = useUserInfoQuery()
      const userHasAccount = !userInfoLoading && userInfo?.whoami?.account?.id

      if (isLoading || userInfoLoading) {
        return null
      }
      if (!user || !isAuthenticated) {
        return <Redirect to="/auth/login" />
      } else if (user && !user?.email_verified) {
        return <Redirect to="/auth/check-email" />
      } else if (user && user?.email_verified && !userHasAccount) {
        return <Redirect to="/signup/account" />
      } else {
        return <Comp {...props} />
      }
    }
    WrappedComponent.displayName = `withAuthorization(${Comp.displayName || 'Comp'})`
    return WrappedComponent
  }
}
