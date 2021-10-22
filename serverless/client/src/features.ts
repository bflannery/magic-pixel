const features = {
  segments: [
    {
      //EXAMPLE USER SEGMENT DEFINITION - DO NOT DELETE THIS ONE
      id: 'exampleSegment',
      users: ['emailThatGetsTheFeature@test.com'] as string[],
      roles: ['ROLE__WITH_FEATURE'] as string[],
    },
    {
      id: 'adminSegment',
      users: [] as string[],
      roles: ['ADMIN'] as string[],
    },
    {
      id: 'engineerSegment',
      users: ['bflannery66@gmail.com'] as string[],
      roles: [] as string[],
    },
  ],
  features: [
    {
      //EXAMPLE FEATURE DEFINITION - DO NOT DELETE THIS ONE
      id: 'exampleFeature',
      description: 'describe this feature so we know what it does',
      allowed: ['exampleSegment'],
    },
    {
      id: 'followerGrowth',
      description: 'this feature enables the Follower Growth block in the dashboard',
      allowed: ['adminSegment'],
    },
  ],
}

export function getFeatureConfig(): typeof features {
  return features
}
