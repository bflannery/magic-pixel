import {formatFieldKey, getDiffFromTimestamp, isValidEmail, uuidv4} from "./utils";

interface MpDataProps {
  accountHid: string
  userId?: string | null
  accountStatus: string
  lastVerified: number,
  attempts: number
}



export interface MagicPixelType {
  hostId: string | null
  apiDomain: string
  mpData: MpDataProps | null
  sessionData: string | null
  authenticateHostData: (mpData: MpDataProps) => Promise<boolean>
  authenticateHostId: () => Promise<boolean>
  clearStorage: () => void
  getLocalStorageData: () => MpDataProps | null
  getSessionStorageData: () => string | null
  setLocalStorageData: (data: MpDataProps) => void
  setSessionStorageData: (sid: string) => void
  trackEvent: (scribeEvent: any) => void
}

interface ScribeFormType {
  formId: string
  formFields: Record<string, string>
}

interface FormFieldMapType {
  email: string | null
  lastName: string | null
  firstName: string | null
}

interface ScribeEventType {
  path: string
  value: {
    fingerprint : string
    sessionId : string
    visitorId : string
    userProfile? : string | null
    form?: ScribeFormType | null
    event: string
    timestamp: string
    source?: {
      url?: {
        host?: string
        hostname?: string
        pathname?: string
        protocol?: string
      }
    }
  }
  op: string,
  success: () => void
  failure: () => void
}


const LOGIN_HINTS = ["login", "signin",  "enter"]
const SIGN_UP_HINTS = ["signup", "join", "enroll", "register", "subscribe"]
const FIRST_NAME_HINTS = ['firstname', 'fname']
const LAST_NAME_HINTS = ['lastname', 'lname']
const PHONE_HINTS = ['phone', 'telephone', 'cell', 'mobile']

export default class MagicPixel {
  hostId: string | null
  apiDomain: string
  mpData: MpDataProps | null
  sessionData: string | null


  constructor(hostId: string | null) {
    this.hostId = hostId
    this.apiDomain = 'http://localhost:5000/dev'
    this.mpData = null
    this.sessionData = null
  }

  async _apiRequest(method: string, endpoint: string, body: BodyInit) {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      })
      return response.json()
    } catch (e) {
      console.error(e)
      return e
    }
  }

  _removeMpData(): void {
    this.mpData = null
    localStorage.removeItem('mp')
  }

  _removeSessionMpData(): void {
    this.sessionData = null
    sessionStorage.removeItem('mp_sid')
  }

  _setMpData(data: MpDataProps | null): boolean {
    this.mpData = data
    return this.mpData === data
  }

  _setSessionMpData(data: string | null): boolean {
    this.sessionData = data
    return this.sessionData === data
  }

  getLocalStorageData() {
    const mpLocalStorageData = localStorage.getItem('mp')
    if (mpLocalStorageData) {
      const parsedData = JSON.parse(mpLocalStorageData)
      this._setMpData(parsedData)
      return parsedData
    }
   return mpLocalStorageData
  }

  getSessionStorageData() {
    const sid = sessionStorage.getItem('mp_sid')
    if (sid) {
      const parsedSessionData = JSON.parse(sid)
      this._setSessionMpData(parsedSessionData)
      return parsedSessionData
    }
    return sid
  }

  setLocalStorageData(data: MpDataProps): void {
    this._setMpData(data)
    localStorage.setItem('mp', JSON.stringify(data))
  }

  setSessionStorageData(sid: string): void {
    this._setSessionMpData(sid)
    sessionStorage.setItem('mp_sid', sid)
  }

  clearStorage(): void {
    this._removeMpData()
    this._removeSessionMpData()
  }

  //
  // parseForm(form: ScribeFormType): FormFieldMapType  {
  //   const formFields = form.formFields
  //   const formFieldsKeys = Object.keys(formFields)
  //
  //   let isLoginForm = false
  //   let isSignupForm = false
  //
  //   const formFieldMap: FormFieldMapType = {
  //     email: null,
  //     firstName: null,
  //     lastName: null,
  //   }
  //
  //  formFieldsKeys.forEach(formFieldKey => {
  //    const formKey = formatFieldKey(formFieldKey)
  //
  //    // Check for signup hints
  //    SIGN_UP_HINTS.forEach((signupHint =>{
  //      const isSignUpKey = formKey.includes(signupHint)
  //      if (isSignUpKey) {
  //        isSignupForm = true
  //      }
  //    }))
  //
  //    // Check for login hints
  //    LOGIN_HINTS.forEach((loginHint =>{
  //      const isLoginKey = formKey.includes(loginHint)
  //      if (isLoginKey) {
  //        isLoginForm = true
  //      }
  //    }))
  //
  //    // Check for first name hints
  //    FIRST_NAME_HINTS.forEach((firstNameHint =>{
  //      const isFirstNameKey = formKey.includes(firstNameHint)
  //      if (isFirstNameKey) {
  //        formFieldMap.firstName = formFields[formKey]
  //      }
  //    }))
  //
  //    // Check for last name hints
  //    LAST_NAME_HINTS.forEach((lastNameHint =>{
  //      const isLastNameKey = formKey.includes(lastNameHint)
  //      if (isLastNameKey) {
  //        formFieldMap.lastName = formFields[formKey]
  //      }
  //    }))
  //
  //    // Check for email
  //    const isEmailKey = formKey.includes("email")
  //    if (isEmailKey) {
  //      formFieldMap.email = formFields[formKey]
  //    }
  //
  //    // If login/signup are false, look for unnamed fields for hints:
  //    if (!isLoginForm && !isSignupForm) {
  //      const anonFormKeyValue = formatFieldKey(formFields[formKey])
  //      // Check for signup hints
  //      SIGN_UP_HINTS.forEach((signupHint =>{
  //        const isSignUpKey = anonFormKeyValue.includes(signupHint)
  //        if (isSignUpKey) {
  //          isSignupForm = true
  //        }
  //      }))
  //
  //      // Check for login hints
  //      LOGIN_HINTS.forEach((loginHint =>{
  //        const isLoginKey = anonFormKeyValue.includes(loginHint)
  //        if (isLoginKey) {
  //          isLoginForm = true
  //        }
  //      }))
  //    }
  //
  //    if ((isLoginForm || isSignupForm) && !formFieldMap.email) {
  //      const formFieldsValues = Object.values(formFields)
  //      const emailValue = formFieldsValues.find(value => isValidEmail(value))
  //      if (emailValue) {
  //        formFieldMap.email = formFields[formKey]
  //      }
  //    }
  //  })
  //   return formFieldMap
  // }

  /**
   * @function: trackEvent
   * @description: The trackEvent function will make an api call to send a scribe event
   * to an event queue if MP object is in a valid state
   */
  async trackEvent(scribeEvent: ScribeEventType): Promise<boolean> {
    try {
      console.log({ scribeEvent, This: this })

      if (this.mpData?.accountStatus !== 'active') {
        return false
      }

      const event = scribeEvent.value
      const fingerprint = event.fingerprint

      if (this.mpData && !this.mpData?.userId) {
        this.mpData.userId = fingerprint
      }

      let accountEvent = {
        ...event,
        accountHid: this.hostId,
        userId: this.mpData?.userId || fingerprint
      }

      console.log({ accountEvent })
      const body = JSON.stringify(accountEvent)
      // const response = await this._apiRequest('POST', `${this.apiDomain}/send-event`, body)
      // if (response.status === '403') {
      //   console.warn("MP: Unauthorized")
      //   // TODO: Invalidate local storage data
      //   return false
      // }
      return true
    } catch (e) {
      console.error('MP: Error sending scribe event to MP server.')
      // TODO: Retry or invalidate local storage data
      return false
    }
  }

  /**
   * @function: authenticateHostId
   * @description: The authenticateHostId function will make an api call to verify the account
   * status based on the host id provided in script. With response data,
   * the function will update the MP class object data and local/session storage
   */
  async authenticateHostId(): Promise<boolean> {
    if (this.hostId) {
      try {
        const jsonBody = JSON.stringify({
          hid: this.hostId
        })
        const accountData = await this._apiRequest(
          'POST',
          `${this.apiDomain}/authentication`, jsonBody
        )

        const localStorageData = {
          accountHid: this.hostId,
          accountStatus: accountData.status,
          lastVerified: Date.now(),
          attempts: this.mpData?.attempts ? this.mpData?.attempts + 1 : 1,
        }
          const sessionId = JSON.stringify(uuidv4())
          this.setLocalStorageData(localStorageData)
          this.setSessionStorageData(sessionId)
          return localStorageData.accountStatus === 'active'
      } catch (e) {
        console.error('MP: Error verifying account.')
        return false
      }
    }
    return false
  }

  /**
   * @function: authenticateHostData
   * @description: Used to verify local storage and MP class object data.
   * The function will check local storage for MP data, and determine if the account
   * is valid through a series of checks on the MP class object around the
   * account id, status, and the last time it was verified
   */

  async authenticateHostData(): Promise<boolean> {
    // If no mpData kill it
    if (!this.mpData) {
      return false
    }

    // If account ids don't match, re-authenticate and update any stale data
    if (this.mpData.accountHid !== this.hostId) {
      return await this.authenticateHostId()
    }

    const { lastVerified, accountStatus } = this.mpData
    const now = new Date().getTime()
    const lastVerifiedHours = getDiffFromTimestamp(now, lastVerified, 'hours')

    // If account is inactive, kill it for 24 hours before trying to re-authenticate again
    // TODO: Add logic for delinquent once Stripe implemented
    if (accountStatus === 'inactive' || accountStatus === 'delinquent') {
      if (lastVerifiedHours < 1) {
        return false
      } else {
        return await this.authenticateHostId()
      }
    }

    // TODO: DO we want to add a way to prevent and future calls for an account?

    // If account is active but hasn't been verified for over an hour, re-authenticate again
    if (accountStatus === 'active') {
      if (lastVerifiedHours >= 1) {
        console.debug(`MP: Re-authenticating host id ${this.hostId}`)
        return await this.authenticateHostId()
      } else {
        return true
      }
    }
    return false
  }

  /**
   * @function: authenticateAccount
   * @description: The authenticateAccount function will authenticate an account
   * based on either host id provided in script or existing local and session storage data
   */
  async authenticateAccount(): Promise<boolean> {
    const mpLocalStorageData = this.getLocalStorageData()
    const mpSessionID = this.getSessionStorageData()
    if (!mpLocalStorageData || !mpSessionID) {
      console.debug(`MP: Invalid browser data. Authenticating host id ${this.hostId}`)
      // Call verification service to check account status and other data
      return await this.authenticateHostId()
    } else {
      console.debug(`MP: Authenticating host storage data for host id ${this.hostId}`)
      return await this.authenticateHostData()
    }
  }
}
