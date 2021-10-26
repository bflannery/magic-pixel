import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box } from '@material-ui/core'
import { HOME_ROUTE } from '../../home/routes'
import { SETTINGS_ROUTE } from '../../settings/routes'
import Home from '../../home/Home'
// import NavSidebar from './components/NavSidebar/NavSidebar'
import Settings from '../../settings/Settings'
// import TopBar from './components/TopBar/TopBar'
import Alert, { AlertData } from '../Alert/Alert'
import withAuthentication from '../../hoc/withAuthentication'
import { DASHBOARD_ROUTE } from '../../dashboard/routes'

const Container: React.FC = () => {
  console.log('CONTAINER')
  const [alert, setAlert] = useState<AlertData | null>(null)

  return (
    <Box display="flex">
      <Box flexGrow={0}>{/*  <NavSidebar roles={roles} loading={loading} username={username} />*/}</Box>
      <Box flexGrow={1}>
        {/*<TopBar email={data?.whoami?.email} loading={loading} />*/}
        <Box paddingY={9}>
          <Switch>
            <Route exact path={HOME_ROUTE.path} component={Home} />
            <Route path={SETTINGS_ROUTE.path} component={Settings} />
            {/*<Route path={DASHBOARD_ROUTE.path} component={Dashboard} />*/}
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
