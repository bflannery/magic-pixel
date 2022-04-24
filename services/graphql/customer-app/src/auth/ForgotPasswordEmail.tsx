import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, makeStyles, Divider } from '@material-ui/core'
import { primary } from '../mp-theme'
import { AlertData } from '../components/Alert/Alert'
import Alert from '../components/Alert'
import { Redirect, Link } from 'react-router-dom'
import { FORGOT_PASSWORD_ROUTE, LOGIN_ROUTE } from './routes'

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto 0',
  },
  card: {
    padding: 20,
    width: 548,
  },
  logo: {
    marginLeft: 1,
  },
  textContainer: {
    margin: '20px 0 30px 0',
  },
  infoContainer: {
    width: '65%',
  },
  title: {
    marginBottom: 5,
    fontSize: 32,
    fontWeight: 600,
  },
  email: {
    fontWeight: 'bold',
  },
  divider: {},
  linkContainer: {
    marginTop: 15,
  },
  text: {
    margin: 0,
  },
  redirect: {
    color: primary[600],
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

interface checkEmailProps {
  location: {
    state: {
      email?: string
    }
  }
}

function Auth0ForgotPasswordEmail(props: checkEmailProps): React.ReactElement {
  const classes = useStyles()
  const [alert, setAlert] = useState<AlertData | null>(null)
  const forgotPasswordEmail = props.location?.state?.email

  if (!forgotPasswordEmail) {
    return <Redirect to={FORGOT_PASSWORD_ROUTE.path} />
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Box>
            <Box>MP Logo</Box>
          </Box>
          <Box className={classes.textContainer}>
            <Typography className={classes.title} variant="h3">
              Check your email.
            </Typography>
            <Box className={classes.infoContainer}>
              <Typography variant="body2" component="span">
                We sent an email to{' '}
              </Typography>
              <Typography variant="body2" component="span" className={classes.email}>
                {forgotPasswordEmail}
              </Typography>
              <Typography variant="body2" component="span">
                {' '}
                with a link to restore your password.
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box className={classes.linkContainer}>
            <Link to={LOGIN_ROUTE.path}>Return to Log in.</Link>
          </Box>
        </CardContent>
      </Card>
      <Alert
        open={!!alert}
        title={alert?.title}
        message={alert?.message || ''}
        severity={alert?.severity || 'error'}
        onClose={() => setAlert(null)}
      />{' '}
    </div>
  )
}

export default Auth0ForgotPasswordEmail
