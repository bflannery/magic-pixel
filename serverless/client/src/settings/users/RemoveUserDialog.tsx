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
} from '@material-ui/core'
import { ReactComponent as CrossIcon } from '../../icons/cross.svg'

const useStyles = makeStyles((theme) =>
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
    removeButton: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.error.dark,
      '&:hover': {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.error.dark,
      },
    },
  }),
)

interface RemoveUserDialogProps {
  email: string
  open: boolean
  onCancel(): void
  onRemove(): void
}

function RemoveUserDialog({ email, open, onCancel, onRemove }: RemoveUserDialogProps): React.ReactElement {
  const classes = useStyles()
  return (
    <Dialog open={open} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          {'Remove user?'}
          <IconButton onClick={onCancel}>
            <CrossIcon width={12} height={12} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography display={'inline'} variant="body2">
          {email}
        </Typography>
        <Typography display={'inline'} variant="body2">
          {' '}
          will no longer have access to LoudCrowd. Please transfer ownership before removing this user
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" className={classes.removeButton} type="submit" onClick={onRemove}>
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RemoveUserDialog
