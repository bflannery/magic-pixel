import React, { useState } from 'react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import { Box } from '@material-ui/core'
import { DASHBOARD_ROUTE } from '../../dashboard/routes'
import { HOME_ROUTE } from '../../home/routes'
import { BILLING_MANAGEMENT_ROUTE, SETTINGS_ROUTE, USER_MANAGEMENT_ROUTE } from '../../settings/routes'
// import Dashboard from '../dashboard/Dashboard'
import Home from '../../home/Home'
// import NavSidebar from './components/NavSidebar/NavSidebar'
import Settings from '../../settings/Settings'
// import TopBar from './components/TopBar/TopBar'
import Alert, { AlertData } from '../Alert/Alert'
import { useUserInfoQuery, UserInfoQuery } from '../../queries/operations/user-info.generated'
import withAuthentication from '../../hoc/withAuthentication'

const Container: React.FC = () => {
  const { data, loading, error: userInfoError } = useUserInfoQuery()

  const roles = data?.whoami?.roles?.map((r) => r.name) || []

  const username = data?.whoami?.email || ''
  const [alert, setAlert] = useState<AlertData | null>(null)

  const billingMatch = useRouteMatch(BILLING_MANAGEMENT_ROUTE.path)
  const userMgmtMatch = useRouteMatch(USER_MANAGEMENT_ROUTE.path)
  if (!loading && !userInfoError && !(billingMatch || userMgmtMatch)) {
    // redirect to billing
    return <Redirect to={BILLING_MANAGEMENT_ROUTE.path} />
  }

  return (
    <Box display="flex">
      <Box flexGrow={0}>{/*  <NavSidebar roles={roles} loading={loading} username={username} />*/}</Box>
      <Box flexGrow={1}>
        {/*<TopBar email={data?.whoami?.email} loading={loading} />*/}
        <Box paddingY={9}>
          <Switch>
            <Route exact path={HOME_ROUTE.path} component={Home} />
            {/*<Route path={DASHBOARD_ROUTE.path} component={Dashboard} />*/}
            {/*<Route path={SETTINGS_ROUTE.path} component={Settings} />*/}
          </Switch>
        </Box>
      </Box>
      <Alert
        open={!!alert}
        title={alert?.title}
        message={alert?.message || ''}
        severity="error"
        onClose={() => setAlert(null)}
      />
    </Box>
  )
}

export default withAuthentication()(Container)
