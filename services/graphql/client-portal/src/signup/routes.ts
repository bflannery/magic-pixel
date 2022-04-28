import { Route } from '../types/route'

export const SIGNUP_ROUTE = new Route('/signup')
export const CREATE_ACCOUNT_ROUTE = SIGNUP_ROUTE.subroute('/account')
