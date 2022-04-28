import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core'
import { Select, TextField } from 'formik-material-ui'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import { useSignupAccountMutation } from './operations/signup-account.generated'
import Alert, { AlertData } from '../components/Alert/Alert'
import { useHistory } from 'react-router-dom'
import { useCurrentUserInfoQuery } from './operations/current-user-info.generated'
import { HOME_ROUTE } from '../home/routes'
import useTitle from '../utils/use-title'

const INDUSTRIES = [
  'Fashion / Apparel',
  'Cosmetics / Beauty',
  'Active / LifeStyle',
  'Consumer Products',
  'Consumer Packaged Goods',
  'Pets / Animals',
  'Home / Furnishings',
  'Retail',
  'Travel / Hospitality',
  'Sports',
  'Food / Garden',
  'Entertainment',
  'Technology',
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bold: { fontWeight: 600 },
    container: {
      backgroundColor: theme.palette.common.white,
      paddingBottom: 72,
      height: '100vh',
      overflow: 'hidden',
    },
    field: {
      marginTop: theme.spacing(5),
      '& .MuiInputLabel-shrink': {
        backgroundColor: theme.palette.common.white,
      },
    },
    textField: {
      marginTop: theme.spacing(5),
      '& .MuiOutlinedInput-input': {
        height: 40,
        paddingLeft: 16,
      },
    },
    select: {
      paddingTop: 12,
      height: 56,
      '& .MuiOutlinedInput-input': {
        paddingLeft: 16,
        '&:hover': {
          borderColor: '#009688',
        },
      },
    },
    roundedRectangleButton: {
      borderRadius: 4,
      marginTop: theme.spacing(5),
    },
  }),
)

const schema = yup.object({
  name: yup.string().trim().required('Name is required.'),
  industry: yup.string().trim(),
  title: yup.string().trim(),
})

export type SignupAccountFormFields = yup.InferType<typeof schema>

const defaultFields: SignupAccountFormFields = {
  name: '',
  industry: '',
  title: '',
}

function CreateAccount(): React.ReactElement {
  useTitle('Create Account')
  const classes = useStyles()
  const history = useHistory()
  const { data: currentUserData, loading: currentUserDataIsLoading } = useCurrentUserInfoQuery()
  if (!!currentUserData?.whoami?.account) {
    //they already have an account, redirect them to home
    history.replace(HOME_ROUTE.path)
  }

  const [signupAccount, { loading: signupIsLoading }] = useSignupAccountMutation()
  const [alert, setAlert] = useState<AlertData | null>(null)

  function onSubmit(fields: SignupAccountFormFields): void {
    signupAccount({
      update: (cache, { data }) => {
        const userId = currentUserData?.whoami?.id
        const cacheKey = cache.identify({ __typename: 'UserType', id: userId })
        cache.evict({ id: cacheKey })
        cache.gc()
      },
      variables: {
        name: fields.name,
        industry: fields.industry,
        title: fields.title,
      },
    })
      .then(() => {
        history.push(HOME_ROUTE.path)
      })
      .catch((error) => {
        setAlert({
          title: "Uh Oh! It looks like that didn't work.",
          message: error.message,
        })
      })
  }

  return (
    <Container maxWidth={false} className={classes.container}>
      <Box width={484} margin="auto">
        <Formik<SignupAccountFormFields> initialValues={defaultFields} validationSchema={schema} onSubmit={onSubmit}>
          <Form noValidate>
            <Box display="flex" flexDirection="column" alignItems="center" pt={27}>
              <Typography className={classes.bold} variant="h4">
                Welcome to Magic Pixel
              </Typography>
              <Box mt={2} mb={6.5}>
                <Typography variant="body1">Tell us a bit about yourself.</Typography>
              </Box>
              <Field
                className={classes.textField}
                variant="outlined"
                component={TextField}
                label="Where do you work?"
                name="name"
                fullWidth
              />

              <FormControl className={classes.field} variant="outlined" fullWidth>
                <InputLabel htmlFor="industry">What industry are you in?</InputLabel>
                <Field
                  component={Select}
                  className={classes.select}
                  name="industry"
                  inputProps={{
                    id: 'industry',
                  }}
                >
                  {INDUSTRIES.map((i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                  <MenuItem value="Other">Other</MenuItem>
                </Field>
              </FormControl>
              <Field
                className={classes.textField}
                variant="outlined"
                component={TextField}
                label="What's your title?"
                name="title"
                fullWidth
              />
              <Button
                disabled={currentUserDataIsLoading || signupIsLoading}
                className={classes.roundedRectangleButton}
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Save and Continue
              </Button>
            </Box>
          </Form>
        </Formik>
        <Alert
          open={!!alert}
          title={alert?.title}
          message={alert?.message || ''}
          severity={alert?.severity || 'error'}
          onClose={() => setAlert(null)}
          autoHideDuration={alert?.autoHideDuration}
        />
      </Box>
    </Container>
  )
}

export default CreateAccount
