import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import useTitle from '../../utils/use-title'
import { useUserInfoQuery } from '../../queries/operations/user-info.generated'
import { useAccountQuery } from './queries/operations/account.generated'
import { useParams } from 'react-router-dom'
import Alert, { AlertData } from '../../components/Alert/Alert'
import { Page } from '../../components'
import HostScript from './HostLink'

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
  const { data: userInfo, loading: userInfoLoading, error: userInfoError } = useUserInfoQuery()
  const accountId = accountIdParam || userInfo?.whoami?.account?.id

  const {
    data: accountInfo,
    loading: accountLoading,
    error: accountError,
  } = useAccountQuery({
    skip: !accountId,
    variables: {
      accountId: accountId || '',
    },
  })

  const accountName = accountInfo?.account?.name
  const accountEmbedScript = accountInfo?.account?.embedScript

  const pageLoading = userInfoLoading || accountLoading
  const pageError = userInfoError || accountError

  if (pageLoading) return <p>Loading</p>
  if (pageError || (!pageLoading && !accountId)) return <p>Error: {pageError && pageError.message}</p>

  return (
    <Page>
      <Box px={6} py={10}>
        <Box display="flex" flex={1}>
          <Typography variant="h5" className={classes.title}>
            Account Management
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography> Account Name: {accountName} </Typography>
          <Typography> Account Id: {accountId}</Typography>
          {accountEmbedScript && <HostScript embedScript={accountEmbedScript} />}
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
