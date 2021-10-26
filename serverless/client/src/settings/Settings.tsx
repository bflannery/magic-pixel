import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import UserManagement from './users/UserManagement'
import { SETTINGS_ROUTE, USER_MANAGEMENT_ROUTE } from './routes'
import withAuthorization from '../hoc/withAuthorization'

const Settings: React.FC = () => {
  return (
    <Switch>
      <Route path={USER_MANAGEMENT_ROUTE.path} component={UserManagement} />
      <Route render={() => <Redirect to={USER_MANAGEMENT_ROUTE.path} />} />
    </Switch>
  )
}

export default withAuthorization(SETTINGS_ROUTE)(Settings)
