import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const auth0Db = process.env.REACT_APP_AUTH0_DB

const Auth0Login: React.FC = () => {
  console.log('Login')
  const { loginWithRedirect } = useAuth0()
  loginWithRedirect({
    connection: auth0Db,
  })
  return null
}

export default Auth0Login
