import { Route } from '../types/route'

export const SETTINGS_ROUTE = new Route('/settings', undefined, undefined)
export const USER_MANAGEMENT_ROUTE = SETTINGS_ROUTE.subroute('/users', ['OWNER'], undefined)
