import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export const sessionLogout = async (): Promise<boolean> => {
  await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/logout`, {
    method: 'POST',
    body: JSON.stringify({}),
    credentials: 'include',
    mode: 'cors',
  })

  return true
}

const Auth0Logout: React.FC = () => {
  const { logout } = useAuth0()
  sessionLogout().then(() => {
    logout({ returnTo: `${window.location.origin}/auth/auth-login` })
  })
  return null
}

export default Auth0Logout
