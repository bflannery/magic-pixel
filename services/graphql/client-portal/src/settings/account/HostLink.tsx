import React from 'react'
import { Link, Box, Typography } from '@material-ui/core'
import { ReactComponent as CopyIcon } from '../../icons/copy.svg'

interface HostLinkProps {
  embedScript: string
}

function HostScript({ embedScript }: HostLinkProps): React.ReactElement {
  function handleClick() {
    navigator.clipboard.writeText(embedScript)
  }

  return (
    <Link variant="body2" color="secondary" underline="hover" onClick={handleClick}>
      <Box display="inline-flex" alignItems="center">
        <Typography style={{ marginRight: 5 }}>Copy embed script</Typography>
        <CopyIcon width={20} height={20} />
      </Box>
    </Link>
  )
}

export default HostScript
