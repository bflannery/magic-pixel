import { Route } from '../types/route'

export const AUTH_ROUTE = new Route('/auth')
export const LOGIN_ROUTE = AUTH_ROUTE.subroute('/login')
export const SIGNUP_ROUTE = AUTH_ROUTE.subroute('/signup')
export const LOGOUT_ROUTE = AUTH_ROUTE.subroute('/logout')
export const CONFIRM_EMAIL_ROUTE = AUTH_ROUTE.subroute('/confirm-email')
export const FORGOT_PASSWORD_ROUTE = AUTH_ROUTE.subroute('/forgot-password')
export const FORGOT_PASSWORD_EMAIL_ROUTE = AUTH_ROUTE.subroute('/password-email')
