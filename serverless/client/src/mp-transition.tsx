import React from 'react'
import { Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

export const DialogTransition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})
