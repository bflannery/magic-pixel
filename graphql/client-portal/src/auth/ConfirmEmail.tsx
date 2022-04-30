import React, { useRef, useState } from 'react'
import { Box, Card, CardContent, Typography, makeStyles, Divider, Link } from '@material-ui/core'
// import { useResendUserEmailMutation } from './operations/resend-user-email.generated'
import { primary } from '../mp-theme'
import Alert, { AlertData } from '../components/Alert/Alert'
import { useAuth0 } from '@auth0/auth0-react'

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
  resendEmail: {
    color: primary[600],
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

function Auth0ConfirmEmail(): React.ReactElement {
  const classes = useStyles()
  const [alert, setAlert] = useState<AlertData | null>(null)

  const { user: auth0User } = useAuth0()
  // const [resentUserEmail] = useResendUserEmailMutation()

  const userEmail = auth0User?.email

  console.log({ auth0User, userEmail })

  async function handleResendEmail() {
    // try {
    //   await resentUserEmail()
    //   setAlert({
    //     title: 'Success: Email Resent',
    //     message: `Sent email to ${userEmail}`,
    //     severity: 'success',
    //     autoHideDuration: 5000,
    //   })
    // } catch (e) {
    //   console.log('An error occurred!', e.message)
    //   setAlert({
    //     title: 'Uh Oh! It looks like we had a problem resending the email.',
    //     message: 'Please try resending that again.',
    //     severity: 'error',
    //   })
    // }
  }

  const resendButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className={classes.root}>
      {userEmail && (
        <Card className={classes.card}>
          <CardContent>
            <Box>MP Logo</Box>
            <Box className={classes.textContainer}>
              <Typography className={classes.title} variant="h3">
                Check your email.
              </Typography>
              <Typography variant="body2" component="p">
                Confirm your email address with a link we sent to:
              </Typography>
              <Typography variant="body2" component="p" className={classes.email}>
                {userEmail}
              </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box className={classes.linkContainer}>
              <Link
                component="button"
                className={classes.resendEmail}
                ref={resendButtonRef}
                onClick={handleResendEmail}
              >
                Resend Email
              </Link>
            </Box>
          </CardContent>
        </Card>
      )}
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

export default Auth0ConfirmEmail
