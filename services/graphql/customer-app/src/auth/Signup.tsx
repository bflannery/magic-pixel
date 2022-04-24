import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CONFIRM_EMAIL_ROUTE } from './routes'

const auth0Db = process.env.REACT_APP_AUTH0_DB

const Auth0Signup: React.FC = () => {
  const { loginWithRedirect } = useAuth0()
  loginWithRedirect({
    screen_hint: 'signup',
    redirectUri: `${window.location.origin}${CONFIRM_EMAIL_ROUTE.path}`,
    connection: auth0Db,
  })
  return null
}

export default Auth0Signup
