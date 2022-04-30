import React from 'react'
import { Route } from '../types/route'
import ContainerError from '../components/ContainerError'
import { useAuthUserInfoQuery } from '../queries/operations/auth-user-info.generated'

const DefaultError: React.FC = () => <ContainerError text="Error loading page" />
const DefaultUnauthorized: React.FC = () => (
  <ContainerError text="Oops! you're not supposed to be here, let's go back and pretend this never happened." />
)

type InnerComponentFactory<WrappedComponentProps> = (
  comp: React.ComponentType<WrappedComponentProps>,
  unauthorizedComponent?: React.ComponentType,
  errorComponent?: React.ComponentType,
) => React.ComponentType<WrappedComponentProps>

export default function withAuthorization<WrappedComponentProps>(
  route: Route,
): InnerComponentFactory<WrappedComponentProps> {
  return (Comp, UnauthorizedComponent = DefaultUnauthorized, ErrorComponent = DefaultError) => {
    const WrappedComponent: React.FC<WrappedComponentProps> = (props) => {
      const { data, error } = useAuthUserInfoQuery()
      if (error) {
        return <ErrorComponent />
      }

      if (!!data?.whoami?.roles) {
        if (
          route.hasAccess(
            data.whoami.roles.map((a) => a.name),
            data.whoami.email,
          )
        ) {
          return <Comp {...props} />
        }
        return <UnauthorizedComponent />
      }
      return null
    }
    WrappedComponent.displayName = `withAuthorization(${Comp.displayName || 'Comp'})`
    return WrappedComponent
  }
}
