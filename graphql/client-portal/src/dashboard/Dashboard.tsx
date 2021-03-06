import React from 'react'
import useTitle from '../utils/use-title'
import Page from '../components/Page/Page'
import withAuthorization from '../hoc/withAuthorization'
import { DASHBOARD_ROUTE } from './routes'

const Dashboard: React.FC = () => {
  useTitle('Dashboard')
  return (
    <Page>
      <div>
        <h1> Dashboard </h1>
      </div>
    </Page>
  )
}

export default withAuthorization(DASHBOARD_ROUTE)(Dashboard)
