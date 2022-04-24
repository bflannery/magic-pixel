import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Paper,
  Box,
  Button,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
} from '@material-ui/core'

import useTitle from '../../utils/use-title'
import { useAccountUsersQuery } from './operations/account-users.generated'
import { useUserInfoQuery } from '../../queries/operations/user-info.generated'
import { useParams, useRouteMatch } from 'react-router-dom'
import { ReactComponent as UserAddIcon } from '../../icons/user-add.svg'
import { AccountUsersQuery } from './operations/account-users.generated'
import UserRow from './UserRow'
import { OWNER_ROLES, USER_ROLES } from './constants'
import InviteUserDialog, { NewUserFormFields } from './InviteUserDialog'
import RemoveUserDialog from './RemoveUserDialog'
import { useCreateUserMutation } from './operations/create-user.generated'
import { useDeleteUserMutation } from './operations/delete-user.generated'
import { UpdateUserMutationVariables, useUpdateUserMutation } from './operations/update-user.generated'
import { useResendUserInviteMutation } from './operations/resend-invite.generated'
import Alert, { AlertData } from '../../components/Alert/Alert'
import { Page } from '../../components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flex: 1,
      lineHeight: 2,
    },
    underline: {
      textDecoration: 'underline',
    },
    firstHeader: {
      paddingLeft: theme.spacing(12),
    },
  }),
)

interface UserMgmtRouteParams {
  id: string
}

export type UserType = NonNullable<NonNullable<AccountUsersQuery['account']>['users']>[number]

const UserManagement: React.FC = () => {
  useTitle('Users - Settings')
  const classes = useStyles()
  const [alert, setAlert] = useState<AlertData | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [selectedRemoveUser, setSelectedRemoveUser] = useState<UserType | null>(null)

  const [createUser] = useCreateUserMutation()
  const [resendInvite] = useResendUserInviteMutation()

  const { id: accountIdParam } = useParams<UserMgmtRouteParams>()
  const inAdminRoute = useRouteMatch('/admin')
  const { data: userInfo } = useUserInfoQuery()

  const accountId = accountIdParam || userInfo?.whoami?.account?.id

  const {
    loading,
    error,
    data: accountData,
  } = useAccountUsersQuery({
    skip: !accountId,
    variables: {
      accountId: accountId?.toString() || '',
    },
  })

  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation({
    update(cache, { data }) {
      if (!data?.deleteUser?.ok || !data?.deleteUser?.user) {
        return
      }
      const cacheId = cache.identify(data.deleteUser.user)
      cache.evict({ id: cacheId })
      cache.gc()
    },
  })

  function handleInviteClick() {
    setInviteDialogOpen(true)
  }

  async function handleOnRoleChange(value: string, userId: string) {
    const roles = value === 'OWNER' ? OWNER_ROLES : USER_ROLES
    const variables: UpdateUserMutationVariables = { userId: userId, roles: roles }
    await updateUser({ variables: variables })
  }

  async function handleOnRemoveUser() {
    if (selectedRemoveUser) {
      const userId = selectedRemoveUser.id.toString()
      const email = selectedRemoveUser.email
      await deleteUser({
        variables: {
          userId,
        },
      })
        .then((data) => {
          if (data.data?.deleteUser?.ok) {
            setAlert({
              title: 'Success: Removed User',
              message: `Removed user ${email}`,
              severity: 'success',
              autoHideDuration: 5000,
            })
          }
          setRemoveDialogOpen(false)
        })
        .catch((error) => {
          const msg = error.message

          setAlert({
            severity: 'error',
            title: 'Error when inviting user',
            message: msg,
          })
        })
    }
  }

  function handleSelectRemoveUser(user: UserType) {
    setSelectedRemoveUser(user)
    return setRemoveDialogOpen(true)
  }

  async function handleResend(userId: string) {
    await resendInvite({ variables: { userId: userId.toString() } }).then((data) => {
      const email = accountData?.account?.users?.find((u) => u.id === userId)?.email
      if (data.data?.resendUserInvite?.ok) {
        if (email) {
          setAlert({
            severity: 'success',
            title: '',
            message: `Invite resent to ${email}`,
            autoHideDuration: 5000,
          })
        }
      } else {
        const title = email ? `Error when resending invite to ${email}` : 'Error when resending invite'

        setAlert({
          severity: 'error',
          title: title,
          message: 'Please contact support for help in resolving this.',
        })
      }
    })
  }

  async function handleInvite(userFields: NewUserFormFields) {
    await createUser({
      variables: {
        email: userFields.email,
        accountId: `${accountId}`,
        roles: userFields.role === 'owner' ? OWNER_ROLES : USER_ROLES,
      },
    })
      .then((data) => {
        const email = data.data?.createUser?.user?.email
        if (email) {
          setAlert({
            severity: 'success',
            title: '',
            message: `Invite sent to ${email}`,
            autoHideDuration: 5000,
          })
        }
        setInviteDialogOpen(false)
      })
      .catch((data) => {
        const error = data.message

        setAlert({
          severity: 'error',
          title: 'Error when inviting user',
          message: error,
        })
      })
  }

  if (loading) return <p>Loading</p>
  if (error || (!loading && !accountData)) return <p>Error: {error && error.message}</p>

  const ownerMode = !!userInfo?.whoami?.roles?.some((r) => r.name === 'OWNER')
  const accountUsers = accountData?.account?.users || []
  const owners = accountUsers.filter((u) => (u.roles || []).find((role) => role.name === 'OWNER'))
  let lastOwner: UserType | null = null

  if (owners.length === 1) {
    lastOwner = owners[0]
  }

  return (
    <Page>
      <Box px={12} py={10}>
        <Box display="flex" flex={1}>
          <Typography variant="h5" className={classes.title}>
            User Management
          </Typography>
        </Box>
        <Box mt={6} display="flex" flex={1} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" display="inline">
              Users
            </Typography>
          </Box>
          {(ownerMode || inAdminRoute) && (
            <Button
              size="large"
              variant="contained"
              color="primary"
              startIcon={<UserAddIcon />}
              onClick={handleInviteClick}
            >
              Invite
            </Button>
          )}
        </Box>
        <Box mt={6}>
          <TableContainer component={Paper}>
            <Table style={{ tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.firstHeader}>
                    <Typography variant="subtitle2" color="textPrimary">
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" color="textPrimary">
                      Role
                    </Typography>
                  </TableCell>
                  {ownerMode && (
                    <>
                      <TableCell>
                        <Typography variant="subtitle2" color="textPrimary">
                          Date Added
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {accountUsers?.map(
                  (user): JSX.Element => (
                    <UserRow
                      isLastOwner={lastOwner?.id === user.id}
                      user={user}
                      key={user.id}
                      ownerMode={ownerMode}
                      onRemoveUser={handleSelectRemoveUser}
                      onResend={handleResend}
                      onRoleChange={handleOnRoleChange}
                    />
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <InviteUserDialog open={inviteDialogOpen} onCancel={() => setInviteDialogOpen(false)} onSave={handleInvite} />
      <RemoveUserDialog
        email={selectedRemoveUser?.email || ''}
        open={removeDialogOpen}
        onCancel={() => setRemoveDialogOpen(false)}
        onRemove={handleOnRemoveUser}
      />
      <Alert
        open={!!alert}
        title={alert?.title}
        message={alert?.message || ''}
        severity={alert?.severity || 'error'}
        onClose={() => setAlert(null)}
        autoHideDuration={alert?.autoHideDuration}
      />
    </Page>
  )
}

export default UserManagement
