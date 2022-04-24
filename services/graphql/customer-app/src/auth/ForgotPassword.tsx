import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, makeStyles, Divider, Link, Button, Theme } from '@material-ui/core'
import { primary } from '../mp-theme'
import { FORGOT_PASSWORD_EMAIL_ROUTE, LOGIN_ROUTE } from './routes'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { TextField } from 'formik-material-ui'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import Alert, { AlertData } from '../components/Alert/Alert'

const useStyles = makeStyles((theme: Theme) => ({
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
  divider: {
    marginTop: theme.spacing(5),
  },
  linkContainer: {
    marginTop: 15,
  },
  text: {
    margin: 0,
  },
  textField: {
    '& .MuiOutlinedInput-input': {
      height: 40,
      paddingLeft: 16,
    },
  },
  roundedRectangleButton: {
    borderRadius: 4,
    marginTop: theme.spacing(5),
  },
  returnToLogin: {
    color: primary[600],
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid ${path}') // eslint-disable-line no-template-curly-in-string
    .required('Email is required.'),
})

export type SignupAccountFormFields = yup.InferType<typeof schema>

const defaultFields: SignupAccountFormFields = {
  email: '',
}

function Auth0ForgotPassword(): React.ReactElement {
  const classes = useStyles()
  const history = useHistory()

  const [alert, setAlert] = useState<AlertData | null>(null)

  const auth0Domain = process.env.REACT_APP_CUSTOM_DOMAIN
  const auth0DB = process.env.REACT_APP_DB
  const auth0ClientId = process.env.REACT_APP_CLIENT_ID

  async function onSubmit(fields: SignupAccountFormFields) {
    try {
      await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client_id: auth0ClientId,
          email: fields.email,
          connection: auth0DB,
        }),
      })
      history.push(FORGOT_PASSWORD_EMAIL_ROUTE.path, { email: fields.email })
    } catch (e) {
      if (e instanceof Error) {
        setAlert({
          severity: 'error',
          title: 'Error while trying to send forgot password email.',
          message: e.message,
        })
      }
    }
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Box>MP Logo</Box>
          <Box className={classes.textContainer}>
            <Typography className={classes.title} variant="h3">
              Forgot your password?
            </Typography>
            <Typography variant="body2" component="p">
              Don’t worry! Enter the email address you signed up with and wait for your recovery details to be sent.
            </Typography>
          </Box>
          <Box>
            <Formik<SignupAccountFormFields>
              initialValues={defaultFields}
              validationSchema={schema}
              onSubmit={onSubmit}
            >
              <Form noValidate>
                <Field
                  className={classes.textField}
                  variant="outlined"
                  component={TextField}
                  label="Email address"
                  name="email"
                  fullWidth
                />
                <Button
                  className={classes.roundedRectangleButton}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Send Email
                </Button>
              </Form>
            </Formik>
          </Box>
          <Divider className={classes.divider} />
          <Box className={classes.linkContainer}>
            <Link
              to={LOGIN_ROUTE.path}
              className={classes.returnToLogin}
              component={RouterLink}
              rel="noopener noreferrer"
            >
              Return to Log in.
            </Link>
          </Box>
        </CardContent>
      </Card>
      <Alert
        open={!!alert}
        title={alert?.title}
        message={alert?.message || ''}
        severity={alert?.severity || 'error'}
        onClose={() => setAlert(null)}
        autoHideDuration={alert?.autoHideDuration}
      />
    </div>
  )
}

export default Auth0ForgotPassword
