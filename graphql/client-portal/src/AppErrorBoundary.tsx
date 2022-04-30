import React from 'react'
import { Box } from '@material-ui/core'
// import NavSidebar from './components/NavSidebar/NavSidebar'
// import TopBar from './components/TopBar/TopBar'
// import ContainerError from './components/ContainerError'

type AppErrorBoundaryState = {
  errored: boolean
}

class AppErrorBoundary extends React.Component<unknown, AppErrorBoundaryState> {
  state = { errored: false }
  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { errored: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log({ error })
  }

  render(): React.ReactNode {
    if (this.state.errored) {
      return (
        <Box display="flex">
          <Box> Error </Box>
        </Box>
      )
    }
    return this.props.children
  }
}

export default AppErrorBoundary
