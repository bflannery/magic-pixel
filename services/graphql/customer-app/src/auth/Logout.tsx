import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Auth0Logout: React.FC = () => {
  const { logout } = useAuth0()
  logout({ returnTo: `${window.location.origin}/auth/login` })
  return null
}

export default Auth0Logout
