import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'

import { ReactComponent as ErrorImage } from '../../images/error.svg'

export interface ContainerErrorProps {
  text: string
}

const ContainerError: React.FC<ContainerErrorProps> = ({ text }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Box>
      <ErrorImage />
    </Box>
    <Typography variant="h5">{text}</Typography>
    <Typography variant="body1" color="secondary">
      Please try again in a few minutes. If you are still having issues, please email:{' '}
    </Typography>
  </Box>
)

export default ContainerError
