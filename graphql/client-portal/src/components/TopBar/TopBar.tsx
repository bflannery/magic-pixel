import React, { useState, useRef } from 'react'
import { AppBar, Box, Toolbar, Button, Avatar, Menu, MenuItem } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import { LOGOUT_ROUTE } from '../../auth/routes'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: 'flex-end',
      paddingRight: theme.spacing(5),
      paddingLeft: theme.spacing(5),
    },
    searchAdornment: {
      marginRight: theme.spacing(7),
    },
    searchIcon: {
      color: theme.palette.secondary.main,
    },
    searchInput: {
      marginLeft: theme.spacing(7),
    },
  }),
)

interface TopBarProps {
  email?: string | null
  organization?: {
    isTrialing?: boolean | null
    trialDaysRemaining?: number | null
  } | null
  loading?: boolean
}

const TopBar: React.FC<TopBarProps> = ({ email, organization, loading }) => {
  const classes = useStyles()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [logout, setLogout] = useState(false)

  const startIcon = loading ? <Skeleton variant="circle" width={40} height={40} /> : <Avatar />

  if (logout) {
    return <Redirect to={LOGOUT_ROUTE.path} />
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar className={classes.toolbar}>
        <Box flexGrow={1} />
        <Button size="large" startIcon={startIcon} disabled={loading} onClick={() => setOpen(true)} ref={buttonRef}>
          {loading ? <Skeleton width={80} /> : email}
        </Button>
        <Menu
          open={open}
          anchorEl={buttonRef.current}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          getContentAnchorEl={null}
        >
          <MenuItem onClick={() => setLogout(true)}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
