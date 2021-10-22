import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router-dom'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { QueryParamProvider } from 'use-query-params'

import theme from './mp-theme'
// import Container from './Container'
import AppErrorBoundary from './AppErrorBoundary'
import { AUTH_ROUTE, SIGNUP_ROUTE } from './auth/routes'
import Auth from './auth/Auth'
// import { SIGNUP_ROUTE } from './signup/routes'
// import SignupContainer from './signup/SignupContainer'

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <BrowserRouter>
          <QueryParamProvider ReactRouterRoute={Route}>
            <AppErrorBoundary>
              <Switch>
                <Route path={AUTH_ROUTE.path} component={Auth} />
                {/*<Route path={SIGNUP_ROUTE.path} component={SignupContainer} />*/}
                {/*<Route component={Container} />*/}
              </Switch>
            </AppErrorBoundary>
          </QueryParamProvider>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  )
}

export default App
