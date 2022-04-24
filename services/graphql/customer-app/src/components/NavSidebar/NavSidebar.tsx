import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Drawer, List } from '@material-ui/core'

import { ReactComponent as AnalyticsIcon } from '../../icons/analytics-major-monotone.svg'
import { ReactComponent as SettingsIcon } from '../../icons/settings-major-monotone.svg'
import { primary } from '../../mp-theme'
import { DASHBOARD_ROUTE } from '../../dashboard/routes'
import NavItem from './NavItem'
import { ACCOUNT_MANAGEMENT_ROUTE, USER_MANAGEMENT_ROUTE } from '../../settings/routes'
import { Route } from '../../types/route'
import AccountAvatar from '../Avatar/AccountAvatar'

const drawerWidth = 260

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: primary[800],
    width: drawerWidth,
    display: 'flex',
    flexDirection: 'column',
  },
  items: {
    paddingRight: '0',
    paddingLeft: 16,
    marginBottom: 4,
  },
  topBlock: {
    flexGrow: 1,
    paddingTop: 0,
  },
})

type NavItemType = {
  route: Route
  label: string
  icon: React.ReactElement | null
}

const navItems: NavItemType[] = [
  {
    route: DASHBOARD_ROUTE,
    label: 'Dashboard',
    icon: <AnalyticsIcon fill="currentColor" height="20px" width="20px" />,
  },
]

const settingsNavItems: NavItemType[] = [
  {
    label: 'Users',
    icon: null,
    route: USER_MANAGEMENT_ROUTE,
  },
  {
    label: 'Account',
    icon: null,
    route: ACCOUNT_MANAGEMENT_ROUTE,
  },
]

interface NavSidebarProps {
  roles?: string[]
  loading: boolean
  userEmail?: string
}

const NavSidebar: React.FC<NavSidebarProps> = ({ loading, roles = [], userEmail = '' }) => {
  const classes = useStyles()
  const shownNavItems = navItems.filter((item) => item.route.hasAccess(roles, userEmail))
  const shownSettingsNavItems = settingsNavItems.filter((item) => item.route && item.route.hasAccess(roles, userEmail))
  return (
    <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
      <Box marginBottom={8} bgcolor={primary[900]} height={64} color="white" display="flex" justifyContent="center">
        <Box margin={2}>
          <AccountAvatar
            loading={loading}
            avatarUrl={'https://upload.wikimedia.org/wikipedia/commons/8/89/Half-Life_lambda_logo.svg'}
            size="small"
          />
        </Box>
      </Box>
      <List className={classes.topBlock}>
        {!loading &&
          shownNavItems.map((item) => (
            <Box key={item.route.path} className={classes.items}>
              <NavItem to={item.route.path} primary={item.label} icon={item.icon || undefined} />
            </Box>
          ))}
        {loading && (
          <>
            <Box className={classes.items}>
              <NavItem loading />
            </Box>
            <Box className={classes.items}>
              <NavItem loading />
            </Box>
          </>
        )}
      </List>
      <List>
        {!!shownSettingsNavItems.length && (
          <Box key={'/Settings'} className={classes.items}>
            <NavItem primary={'Settings'} icon={<SettingsIcon fill="currentColor" height="20px" width="20px" />}>
              {shownSettingsNavItems.map((item) => (
                <Box key={item.route.path} className={classes.items}>
                  <NavItem to={item.route.path} primary={item.label} />
                </Box>
              ))}
            </NavItem>
          </Box>
        )}
      </List>
      <Box color="white" marginY={1} marginX={8}>
        <h3> MP Logo </h3>
      </Box>
    </Drawer>
  )
}

export default NavSidebar
