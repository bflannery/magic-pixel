import React, { useEffect } from 'react'
import { Container } from '@material-ui/core'

interface PageProps {
  children: React.ReactElement | React.ReactElement[]
}

const Page: React.FC<PageProps> = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <Container>{children}</Container>
}

export default Page
