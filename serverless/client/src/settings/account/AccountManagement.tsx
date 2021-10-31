import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import useTitle from '../../utils/use-title'
import { useUserInfoQuery } from '../../queries/operations/user-info.generated'
import { useParams } from 'react-router-dom'
import Alert, { AlertData } from '../../components/Alert/Alert'
import { Page } from '../../components'
import { useAccountUsersQuery } from '../users/operations/account-users.generated'

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

interface AcctMgmtRouteParams {
  id: string
}

const AccountManagement: React.FC = () => {
  useTitle('Settings - Account')
  const classes = useStyles()
  const [alert, setAlert] = useState<AlertData | null>(null)

  const { id: accountIdParam } = useParams<AcctMgmtRouteParams>()
  const { data: userInfo, loading, error } = useUserInfoQuery()

  const accountId = accountIdParam || userInfo?.whoami?.account?.id

  if (loading) return <p>Loading</p>
  if (error || (!loading && !accountId)) return <p>Error: {error && error.message}</p>

  return (
    <Page>
      <Box px={12} py={10}>
        <Box display="flex" flex={1}>
          <Typography variant="h5" className={classes.title}>
            Account Management
          </Typography>
        </Box>
      </Box>
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

export default AccountManagement
