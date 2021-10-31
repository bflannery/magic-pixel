import React from 'react'
import { makeStyles, createStyles, Avatar, Box } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { LinkProps } from 'react-router-dom'

const diameters = {
  xsmall: 40,
  small: 48,
  medium: 56,
  large: 64,
}
const useStyles = makeStyles(() => {
  return createStyles({
    ring: {
      justifyContent: 'center',
      overflow: 'hidden',
      alignItems: 'center',
      display: 'flex',
      padding: '2px',
      backgroundImage: 'linear-gradient(#5500FF, #BA46ED)',
      borderRadius: '50%',
      '& .MuiAvatar-img': {
        background: 'white',
        border: '2px solid white',
        borderRadius: '50%',
      },
    },
    xsmall: {
      width: diameters.xsmall,
      height: diameters.xsmall,
    },
    small: {
      width: diameters.small,
      height: diameters.small,
    },
    medium: {
      width: diameters.medium,
      height: diameters.medium,
    },
    large: {
      width: diameters.large,
      height: diameters.large,
    },
  })
})

interface AccountAvatarProps {
  loading?: boolean
  avatarUrl?: string | null
  alt?: string | null
  size?: 'xsmall' | 'small' | 'medium' | 'large'
  linkProps?: Partial<LinkProps>
}
const AccountAvatar: React.FC<AccountAvatarProps> = ({
  alt,
  loading = false,
  avatarUrl,
  size = 'xsmall',
  linkProps = {},
}) => {
  const classes = useStyles()

  return (
    <Box className={classes[size]}>
      {loading ? (
        <Skeleton width={diameters[size]} height={diameters[size]} variant="circle" />
      ) : (
        <Avatar
          className={classes[size]}
          src={avatarUrl || undefined}
          alt={alt || undefined}
          component="a"
          {...linkProps}
        />
      )}
    </Box>
  )
}

export default AccountAvatar
