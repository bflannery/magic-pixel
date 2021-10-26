import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Drawer, List } from '@material-ui/core'

import { ReactComponent as AnalyticsIcon } from '../../icons/analytics-major-monotone.svg'
import { ReactComponent as SettingsIcon } from '../../icons/settings-major-monotone.svg'
import { primary } from '../../mp-theme'
import { DASHBOARD_ROUTE } from '../../dashboard/routes'
import NavItem from './NavItem'
import { USER_MANAGEMENT_ROUTE } from '../../settings/routes'
import { Route } from '../../types/route'

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
  allowFbTester: boolean
  requiresProducts: boolean
  dataIntercomTarget?: string
}

const navItems: NavItemType[] = [
  {
    route: DASHBOARD_ROUTE,
    label: 'Dashboard',
    icon: <AnalyticsIcon fill="currentColor" height="20px" width="20px" />,
    allowFbTester: true,
    requiresProducts: true,
  },
]

const settingsNavItems: NavItemType[] = [
  {
    label: 'Users',
    icon: null,
    route: USER_MANAGEMENT_ROUTE,
    requiresProducts: false,
    allowFbTester: false,
  },
]

interface NavSidebarProps {
  roles?: string[]
  loading: boolean
  userEmail?: string
  noPicker?: boolean
}

const NavSidebar: React.FC<NavSidebarProps> = ({ loading, roles = [], userEmail = '', noPicker = false }) => {
  const classes = useStyles()
  const shownNavItems = navItems.filter((item) => item.route.hasAccess(roles, userEmail))
  const shownSettingsNavItems = settingsNavItems.filter((item) => item.route && item.route.hasAccess(roles, userEmail))
  return (
    <Drawer className={classes.drawer} variant="permanent" anchor="left" classes={{ paper: classes.drawerPaper }}>
      <Box mb={5} bgcolor={primary[900]} height={80} color="white"></Box>
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
