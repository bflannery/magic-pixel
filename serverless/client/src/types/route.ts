import { userHasFeature } from '../utils/feature-manager'
export class Route {
  readonly path: string
  readonly anyRole?: Set<string>
  readonly featureFlag?: string

  constructor(path: string, anyRole?: string[], featureFlag?: string) {
    this.path = path
    this.anyRole = anyRole ? new Set(anyRole) : undefined
    this.featureFlag = featureFlag
  }

  // Create subroute, inheriting roles unless overridden
  subroute(subpath: string, subRouteSpecificRoles?: string[], featureFlag?: string): Route {
    let roles = subRouteSpecificRoles
    if (!subRouteSpecificRoles) {
      roles = this.anyRole ? Array.from(this.anyRole) : undefined
    }
    return new Route(`${this.path}${subpath}`, roles, featureFlag)
  }

  hasAccess(roles: string[] = [], username = ''): boolean {
    if (this.featureFlag) {
      if (!userHasFeature({ username: username, roles: roles }, this.featureFlag)) {
        return false
      }
    }
    return !this.anyRole || roles.some((r) => this.anyRole?.has(r))
  }
}
