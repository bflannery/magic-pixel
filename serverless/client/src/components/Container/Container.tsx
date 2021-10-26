import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box } from '@material-ui/core'
import { HOME_ROUTE } from '../../home/routes'
import { SETTINGS_ROUTE } from '../../settings/routes'
import Home from '../../home/Home'
import Dashboard from '../../dashboard/Dashboard'
import Settings from '../../settings/Settings'
// import TopBar from './components/TopBar/TopBar'
import Alert, { AlertData } from '../Alert/Alert'
import withAuthentication from '../../hoc/withAuthentication'
import { DASHBOARD_ROUTE } from '../../dashboard/routes'
import { useUserInfoQuery } from '../../queries/operations/user-info.generated'
import NavSidebar from '../NavSidebar/NavSidebar'

const Container: React.FC = () => {
  const [alert, setAlert] = useState<AlertData | null>(null)
  const { data, loading } = useUserInfoQuery()
  const roles = data?.whoami?.roles?.map((r) => r.name) || []
  const userEmail = data?.whoami?.email || ''
  return (
    <Box display="flex">
      <Box flexGrow={0}>
        <NavSidebar roles={roles} loading={loading} userEmail={userEmail} />
      </Box>
      <Box flexGrow={1}>
        {/*<TopBar email={data?.whoami?.email} loading={loading} />*/}
        <Box paddingY={9}>
          <Switch>
            <Route exact path={HOME_ROUTE.path} component={Home} />
            <Route path={DASHBOARD_ROUTE.path} component={Dashboard} />
            <Route path={SETTINGS_ROUTE.path} component={Settings} />
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
