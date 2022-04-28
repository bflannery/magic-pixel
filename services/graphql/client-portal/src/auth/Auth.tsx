import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
  CONFIRM_EMAIL_ROUTE,
  FORGOT_PASSWORD_EMAIL_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  SIGNUP_ROUTE,
} from './routes'
import Login from './Login'
import Logout from './Logout'
import ConfirmEmail from './ConfirmEmail'
import ForgotPasswordEmail from './ForgotPasswordEmail'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'

const Auth: React.FC = () => {
  return (
    <Switch>
      <Route path={LOGIN_ROUTE.path} component={Login} />
      <Route path={SIGNUP_ROUTE.path} component={Signup} />
      <Route path={LOGOUT_ROUTE.path} component={Logout} />
      <Route path={CONFIRM_EMAIL_ROUTE.path} component={ConfirmEmail} />
      <Route path={FORGOT_PASSWORD_ROUTE.path} component={ForgotPassword} />
      <Route path={FORGOT_PASSWORD_EMAIL_ROUTE.path} component={ForgotPasswordEmail} />
    </Switch>
  )
}

export default Auth
