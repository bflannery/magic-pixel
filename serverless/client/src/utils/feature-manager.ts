import { getFeatureConfig } from '../features'
import { UserType } from '../gql-global'

type GQLUser = Pick<UserType, 'email' | 'roles' | '__typename'>

export interface FeatureUserType {
  username: string
  roles: string[] | null
}

export const userHasFeature = (user: FeatureUserType | GQLUser, featureName: string): boolean => {
  let username: string
  let roles: string[]
  if ('__typename' in user) {
    username = user.email
    roles = user.roles?.map((r) => r.name) || []
  } else {
    username = user.username
    roles = user.roles || []
  }
  const features = getFeatureConfig()
  const feature = features.features.find((feature) => feature.id === featureName)
  if (!feature) {
    return false
  }
  let result = false
  feature.allowed.forEach((segmentName: string) => {
    const segment = features.segments.find((segment) => segment.id === segmentName)
    if (segment) {
      //check explicit username
      if (segment.users.includes(username)) {
        result = true
      }

      //check roles
      if (roles.some((role) => segment.roles.includes(role))) {
        result = true
      }
    }
  })
  return result
}
