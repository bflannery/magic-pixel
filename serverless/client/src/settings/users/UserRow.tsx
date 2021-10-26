import React, { useRef, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'
import { UserType } from './UserManagement'
import { AVAILABLE_ROLES, ROLES } from './constants'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactComponent as Checkmark } from '../../icons/checkmark.svg'
import Tooltip from '../../components/Tooltip/Tooltip'
import { format, formatDistanceToNow } from 'date-fns'
import { ReactComponent as KebabIcon } from '../../icons/kebab.svg'
import { ReactComponent as DownChevron } from '../../icons/chevron-down_minor.svg'

interface UserRowProps {
  isLastOwner: boolean
  user: UserType
  ownerMode: boolean
  onRoleChange: (value: string, id: number) => void
  onRemoveUser: (user: UserType) => void
  onResend: (id: number) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rolesForm: {
      minWidth: 100,
    },
    roleMenu: {
      minWidth: 150,
    },
    select: {
      '& $checkmark': {
        display: 'none',
      },
      '&:focus': {
        backgroundColor: 'transparent',
      },
    },
    selectIcon: {
      fontWeight: theme.typography.fontWeightBold,
      height: 24,
      width: 20,
      color: theme.palette.primary.main,
    },
    checkmarkHidden: {
      minWidth: 15,
      color: theme.palette.primary.main,
      visibility: 'hidden',
      marginRight: theme.spacing(2),
    },
    checkmark: {
      minWidth: 15,
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2),
    },
    roleName: {
      marginRight: theme.spacing(0),
    },
    menuItem: {
      paddingLeft: theme.spacing(5),
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
    dateAddedCell: {
      minWidth: 150,
    },
    underline: {
      textDecoration: 'underline',
    },
    firstColumn: {
      paddingLeft: theme.spacing(12),
    },
    listItem: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
)

function DateTableCell({ date }: { date?: Date | null }): React.ReactElement {
  const classes = useStyles()
  return (
    <TableCell className={classes.dateAddedCell}>
      {date ? (
        <Tooltip title={format(date, 'PPp')} placement="top-start">
          <Typography className={classes.underline} variant="body2">
            {formatDistanceToNow(date, { addSuffix: true })}
          </Typography>
        </Tooltip>
      ) : (
        ''
      )}
    </TableCell>
  )
}

const UserRow: React.FC<UserRowProps> = ({ isLastOwner, user, ownerMode, onRoleChange, onResend, onRemoveUser }) => {
  const classes = useStyles()
  const { id, email, roles, createdAt, lastLoginAt } = user
  const [actionMenuOpen, setActionMenuOpen] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const kebabButtonRef = useRef<HTMLButtonElement>(null)

  const userRole = roles?.some((r) => r.name === 'OWNER') ? 'OWNER' : 'USER'

  const roleObj = ROLES.find((r) => r.value === userRole) || ROLES[0]

  return (
    <TableRow>
      <TableCell className={classes.firstColumn}>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" color={email.includes('@loudcrowd.com') ? 'secondary' : 'textPrimary'}>
            {email}
          </Typography>
          {!lastLoginAt && (
            <Box ml={3}>
              <Chip size="small" label="PENDING" />
            </Box>
          )}
        </Box>
      </TableCell>
      <TableCell>
        {ownerMode ? (
          <FormControl className={classes.rolesForm}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setIsOpen(!isOpen)}
              endIcon={<DownChevron width={16} />}
              color="primary"
              ref={buttonRef}
            >
              {roleObj.name}
            </Button>
            <Menu
              open={isOpen}
              anchorEl={buttonRef.current}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              getContentAnchorEl={null}
              onClose={() => setIsOpen(false)}
              classes={{ paper: classes.roleMenu }}
            >
              {AVAILABLE_ROLES.map((role) => (
                <MenuItem
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.value, id)
                    setIsOpen(false)
                  }}
                  className={classes.listItem}
                >
                  <ListItemIcon className={userRole === role.value ? classes.checkmark : classes.checkmarkHidden}>
                    <Checkmark width={9} height={9} />
                  </ListItemIcon>
                  <ListItemText disableTypography>{role.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </FormControl>
        ) : (
          <Typography variant="subtitle1" color="primary">
            {roleObj.name}
          </Typography>
        )}
      </TableCell>
      {ownerMode && (
        <>
          <DateTableCell date={createdAt} />
          <TableCell>
            <IconButton ref={kebabButtonRef} onClick={() => setActionMenuOpen(true)} color="primary">
              <KebabIcon width={20} height={20} />
            </IconButton>
            <Menu
              open={actionMenuOpen}
              anchorEl={kebabButtonRef.current}
              onClose={() => setActionMenuOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              getContentAnchorEl={null}
            >
              <Tooltip title={isLastOwner ? 'Your account must have at least one owner' : ''}>
                <Box>
                  <MenuItem
                    disabled={isLastOwner}
                    onClick={() => {
                      setActionMenuOpen(false)
                      onRemoveUser(user)
                    }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      Remove User
                    </Typography>
                  </MenuItem>
                </Box>
              </Tooltip>
              {!lastLoginAt && (
                <MenuItem
                  onClick={() => {
                    setActionMenuOpen(false)
                    onResend(id)
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Resend Invite
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

export default UserRow
