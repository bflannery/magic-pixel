import { createStyles, makeStyles, Container, Theme } from '@material-ui/core'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import useTitle from '../utils/use-title'
import SignupAccount from './SignupAccount'
import { CREATE_ACCOUNT_ROUTE } from './routes'
import { secondary } from '../mp-theme'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.common.white,
      paddingBottom: 72,
      height: '100vh',
      overflow: 'hidden',
    },
    topbar: {
      borderColor: secondary[400],
    },
    progressbar: {
      backgroundColor: theme.palette.secondary.light,
      borderRadius: 444,
      height: 8,

      '& .MuiLinearProgress-bar1Determinate': {
        borderRadius: 444,
      },
    },
  }),
)

function SignupContainer(): React.ReactElement {
  const classes = useStyles()
  useTitle('Signup - Create Account')

  return (
    <Container maxWidth={false} className={classes.container}>
      <Switch>
        <Route component={SignupAccount} path={CREATE_ACCOUNT_ROUTE.path} exact />
      </Switch>
    </Container>
  )
}

export default SignupContainer
