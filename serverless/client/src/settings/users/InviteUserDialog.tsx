import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  createStyles,
  IconButton,
  Box,
  Typography,
  Radio,
  FormControlLabel,
} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { RadioGroup, TextField } from 'formik-material-ui'
import * as yup from 'yup'
import { ReactComponent as CrossIcon } from '../../icons/cross.svg'

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      width: 420,
    },
    textField: {
      marginBottom: theme.spacing(4),
    },
    content: {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
    radioRoot: {
      color: theme.palette.text.hint,
    },
  }),
)

const fieldSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid ${path}') // eslint-disable-line no-template-curly-in-string
    .required(),
  role: yup.string().required(),
})

export type NewUserFormFields = yup.InferType<typeof fieldSchema>

interface InviteUserDialogProps {
  open: boolean
  onCancel(): void
  onSave(newUser: NewUserFormFields): void
}

function InviteUserDialog({ open, onCancel, onSave }: InviteUserDialogProps): React.ReactElement {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={onCancel} classes={{ paper: classes.paper }}>
      <Formik<NewUserFormFields>
        initialValues={{ email: '', role: 'user' }}
        validationSchema={fieldSchema}
        onSubmit={onSave}
      >
        <Form noValidate>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between">
              {'Invite others to LoudCrowd'}
              <IconButton onClick={onCancel}>
                <CrossIcon width={12} height={12} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent className={classes.content}>
            <Typography variant="body2">{`Get more EMV when you invite team users`}</Typography>
            <Field
              className={classes.textField}
              component={TextField}
              label="Email"
              type="email"
              name="email"
              helperText=" "
              fullWidth
            />
            <Field component={RadioGroup} name="role">
              <Box display="flex">
                <FormControlLabel
                  value="user"
                  control={
                    <Radio
                      color="primary"
                      classes={{
                        root: classes.radioRoot,
                      }}
                    />
                  }
                  label="User"
                />
                <FormControlLabel
                  value="owner"
                  control={
                    <Radio
                      color="primary"
                      classes={{
                        root: classes.radioRoot,
                      }}
                    />
                  }
                  label="Owner"
                />
              </Box>
            </Field>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Invite
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  )
}

export default InviteUserDialog
