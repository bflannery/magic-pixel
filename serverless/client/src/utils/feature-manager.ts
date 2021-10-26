import { getFeatureConfig } from '../features'
import { UserType } from '../gql-global'

type GQLUser = Pick<UserType, 'email' | 'roles' | '__typename'>

export interface FeatureUserType {
  email: string | null
  roles: string[] | null
}

export const userHasFeature = (user: FeatureUserType | GQLUser, featureName: string): boolean => {
  let userEmail: string
  let roles: string[]
  if ('__typename' in user) {
    userEmail = user.email
    roles = user.roles?.map((r) => r.name) || []
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
      if (segment.users.includes(userEmail)) {
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
