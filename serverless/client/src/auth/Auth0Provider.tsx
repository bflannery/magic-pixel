import React from 'react'
import { useHistory } from 'react-router-dom'
import { Auth0Provider, useAuth0, AppState } from '@auth0/auth0-react'
import { ApolloProvider } from '@apollo/client/react'
import createClient from '../apollo-client'

const auth0Domain = process.env.REACT_APP_AUTH0_CUSTOM_DOMAIN
const auth0ApiUrl = process.env.REACT_APP_AUTH0_API_URL
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID

const AuthorizedApolloProvider: React.FC = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0()
  const client = createClient(getAccessTokenSilently)
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

const Auth0ProviderWithHistory: React.FC = ({ children }) => {
  const history = useHistory()

  const onRedirectCallback = (appState: AppState) => {
    history.push(appState?.returnTo || window.location.pathname)
  }

  console.log({ auth0Domain, auth0ClientId, auth0ApiUrl })
  return (
    <Auth0Provider
      domain={auth0Domain || ''}
      clientId={auth0ClientId || ''}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={auth0ApiUrl}
      scope="read:current_user update:user_metadata"
    >
      <AuthorizedApolloProvider>{children}</AuthorizedApolloProvider>
    </Auth0Provider>
  )
}

export default Auth0ProviderWithHistory
