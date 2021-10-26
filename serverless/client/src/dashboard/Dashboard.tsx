import React from 'react'
import useTitle from '../utils/use-title'
import Page from '../components/Page/Page'

const Dashboard: React.FC = () => {
  useTitle('Dashboard')
  return (
    <Page>
      <div>
        <h1> Dashboard </h1>
      </div>
    </Page>
  )
}
