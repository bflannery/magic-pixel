import React, { useState, useEffect } from 'react'
import { Snackbar, Typography } from '@material-ui/core'
import { Alert as MUIAlert, AlertTitle as MUIAlertTitle } from '@material-ui/lab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export type AlertData = {
  title?: string
  message: string
  severity?: 'success' | 'info' | 'warning' | 'error' | undefined
  autoHideDuration?: number
}

interface AlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error' | undefined
  title?: string
  message: string
  open?: boolean
  onClose?(): void
  icon?: React.ReactNode
  autoHideDuration?: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    alert: {
      width: '550px',
    },
    icon: {
      marginRight: theme.spacing(4),
      '& svg': {
        height: 30,
        width: 30,
      },
    },
    title: {
      marginBottom: 0,
    },
  }),
)

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  severity,
  open = false,
  onClose,
  icon = null,
  autoHideDuration,
}) => {
  const classes = useStyles()

  const [alertState, setState] = useState<AlertData | null>(null)

  useEffect(() => {
    if (open === true && alertState === null) {
      setState({ severity, title, message })
    }
  }, [severity, title, message, open, alertState])

  function handleOnExit() {
    setState(null)
  }

  return (
    <Snackbar
      open={open}
      message=""
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionProps={{ onExited: handleOnExit }}
    >
      <MUIAlert
        square
        severity={alertState?.severity}
        elevation={1}
        classes={{
          root: classes.alert,
          icon: classes.icon,
        }}
        icon={icon}
        onClose={onClose}
      >
        {alertState?.title && <MUIAlertTitle className={classes.title}>{alertState?.title}</MUIAlertTitle>}
        <Typography>{alertState?.message}</Typography>
      </MUIAlert>
    </Snackbar>
  )
}

export default Alert
