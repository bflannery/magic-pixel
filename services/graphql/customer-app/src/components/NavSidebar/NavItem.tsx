import React, { useState } from 'react'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  createStyles,
  Collapse,
  List,
  ClickAwayListener,
} from '@material-ui/core'
import { Link, LinkProps, useRouteMatch } from 'react-router-dom'

import { secondary, primary } from '../../mp-theme'
import { Skeleton } from '@material-ui/lab'

interface NavItemProps {
  icon?: React.ReactElement
  primary?: string
  to?: string
  loading?: boolean
  dataIntercomTarget?: string | null
}

interface ClickAwayWrapperProps {
  expandable: boolean
  onClickAway(): void
}
const ClickAwayWrapper: React.FC<ClickAwayWrapperProps> = ({ expandable, onClickAway, children }) =>
  expandable ? <ClickAwayListener onClickAway={onClickAway}>{children}</ClickAwayListener> : <>{children}</>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: secondary[600],
      svg: {
        color: secondary[600],
      },
      backgroundColor: primary[800],
      borderRadius: '44px 0 0 44px',
      '&:hover': {
        color: theme.palette.common.white,
        backgroundColor: primary[800],
      },
      '&$selected': {
        color: theme.palette.common.white,
        backgroundColor: primary[600],
      },
    },
    selected: {},
    listItemIcon: {
      color: 'inherit',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
)

const NavItem: React.FC<NavItemProps> = ({ icon, primary, to, loading, children, dataIntercomTarget }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const match = useRouteMatch({
    path: to,
  })

  const renderLink = React.useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'innerRef' | 'component' | 'to'>>((itemProps, ref) => (
        // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
        // See https://github.com/ReactTraining/react-router/issues/6056
        <Link to={to || ''} {...itemProps} innerRef={ref} />
      )),
    [to],
  )

  const expandable = !!children

  return (
    <ClickAwayWrapper expandable={expandable} onClickAway={() => setOpen(false)}>
      <div data-intercom-target={dataIntercomTarget || undefined}>
        <ListItem
          button
          component={loading || expandable ? 'div' : renderLink}
          classes={{ root: classes.root, selected: classes.selected }}
          selected={!!match}
          onClick={() => {
            if (expandable) setOpen(!open)
          }}
        >
          {icon && <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>}
          {loading && (
            <ListItemIcon className={classes.listItemIcon}>
              <Skeleton />
            </ListItemIcon>
          )}
          <ListItemText>{loading ? <Skeleton /> : primary}</ListItemText>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children}
          </List>
        </Collapse>
      </div>
    </ClickAwayWrapper>
  )
}

export default NavItem
