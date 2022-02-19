import { DomAttributeType, DomElementType, DomLinkType, DomMapType } from './types'

function scriptIsHTML(script: HTMLOrSVGScriptElement): script is HTMLScriptElement {
  return 'src' in script
}

export function getSiteId(script: HTMLOrSVGScriptElement | null): string | null {
  if (window.MP_SID) {
    return window.MP_SID
  }
  if (!script) {
    console.error('MP: script requires being loaded from mp source')
    return null
  }
  if (!scriptIsHTML(script)) {
    console.error('MP: mp does not support SVG scripts.')
    return null
  }

  const url = new URL(script.src)
  return url.searchParams.get('sid')
}

export function getDiffFromTimestamp(time1: number, time2: number, scope: 'days' | 'hours' | 'mins'): number {
  const timeDiff = time1 - time2

  if (scope === 'days') {
    return timeDiff / (1000 * 3600 * 24)
  } else if (scope === 'hours') {
    return timeDiff / (60 * 60 * 1000)
  } else {
    return timeDiff / (60 * 1000)
  }
}

export function uuidv4(): string {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export function formatFieldKey(key: string): string {
  return key.replace(/[_-]/g, '').toLocaleLowerCase()
}

export function isValidEmail(email: string) {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return email.match(emailRegex)
}

export const isChildLink = (ancestors: Element[]) => {
  let isChildLink = false
  for (let i = 0; i < ancestors.length; i++) {
    const element = ancestors[i]
    if (element.tagName == 'A') {
      isChildLink = true
    }
  }
  return isChildLink
}

export interface toObjectInterface {
  [key: string]: any
}

export const toObject = (olike: toObjectInterface) => {
  const o: toObjectInterface = {}
  let key

  for (key in olike) {
    o[key] = olike[key]
  }

  return o
}

const isObject = (object: object): boolean => {
  return object != null && typeof object === 'object'
}

export const deepEqual = (object1: toObjectInterface, object2: toObjectInterface): boolean => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) {
    return false
  }
  for (const key of keys1) {
    const val1 = object1[key]
    const val2 = object2[key]
    const areObjects = isObject(val1) && isObject(val2)
    if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false
    }
  }
  return true
}

export const undup = function (f: Function, cutoff?: number) {
  cutoff = cutoff || 250

  var lastInvoked = 0
  return function () {
    var curTime = new Date().getTime()
    var delta = curTime - lastInvoked

    if (cutoff && delta > cutoff) {
      lastInvoked = curTime

      return f.apply(null, arguments)
    } else {
      return undefined
    }
  }
}

export const parseQueryString = (qs: string): object => {
  const pairs: toObjectInterface = {}

  if (qs.length > 0) {
    const query = qs.charAt(0) === '?' ? qs.substring(1) : qs

    if (query.length > 0) {
      const vars = query.split('&')
      for (let i = 0; i < vars.length; i++) {
        if (vars[i].length > 0) {
          const pair = vars[i].split('=')

          try {
            const name = decodeURIComponent(pair[0])
            pairs[name] = pair.length > 1 ? decodeURIComponent(pair[1]) : 'true'
          } catch (e) {
            console.error(e)
          }
        }
      }
    }
  }
  return pairs
}

export interface ParsedURLProps {
  href: string | null
  hash: string | null
  host: string | null
  hostname: string | null
  pathname: string | null
  protocol: string | null
  query: toObjectInterface
}

export const parseUrl = (url: string) => {
  const link = document.createElement('a')
  link.href = url
  if (link.host === '') {
    link.host = link.href
  }
  return {
    href: link.href,
    hash: link.hash,
    host: link.host,
    hostname: link.hostname,
    pathname: link.pathname,
    protocol: link.protocol,
    query: parseQueryString(link.search),
  }
}

export const parseLocation = (location: Location): ParsedURLProps => {
  return {
    href: location.href,
    hash: location.hash,
    host: location.host,
    hostname: location.hostname,
    pathname: location.pathname,
    protocol: location.protocol,
    query: parseQueryString(location.search),
  }
}

export const isSamePage = (url1: string, url2: string) => {
  const url1Object: ParsedURLProps = parseUrl(url1)
  const url2Object: ParsedURLProps = parseUrl(url2)

  // Ignore the hash when comparing to see if two pages represent the same resource:
  return (
    url1Object.protocol === url2Object.protocol &&
    url1Object.host === url2Object.host &&
    url1Object.pathname === url2Object.pathname &&
    deepEqual(url1Object.query, url2Object.query)
  )
}
