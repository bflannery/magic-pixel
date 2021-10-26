import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { DASHBOARD_ROUTE } from '../dashboard/routes'
import ContainerError from '../components/ContainerError'
import { useWhatAreMyRolesQuery } from './operations/what-are-my-roles.generated'
import { BILLING_MANAGEMENT_ROUTE } from '../settings/routes'

const Home: React.FC = () => {
  const { data, loading, error } = useWhatAreMyRolesQuery()
  const [isUnloading, setIsUnloading] = useState(false)
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      setIsUnloading(true)
    })
  })
  const unauthedError = (error?.graphQLErrors || []).some((e) => e.extensions?.code === 'UNAUTHENTICATED')
  if (isUnloading || loading || unauthedError) return <div />
  if (error || !data?.whoami?.roles) {
    return <ContainerError text="Something went wrong" />
  }

  const roles = data.whoami.roles.map((r) => r.name)

  let path: string | undefined
  if (DASHBOARD_ROUTE.hasAccess(roles, '')) {
    path = DASHBOARD_ROUTE.path
  } else {
    path = BILLING_MANAGEMENT_ROUTE.path
  }

  return <Redirect to={path} />
}

export default Home
