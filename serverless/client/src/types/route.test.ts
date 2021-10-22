import { Route } from './route'
import * as fm from '../utils/feature-manager'
import { AccountProductName } from '../gql-global'

type Writable<T> = { -readonly [P in keyof T]: T[P] }

describe('route.hasAccess', () => {
  it('returns true if no required roles or ffs', () => {
    const route = new Route('/test')
    expect(route.hasAccess(['rand', 'roles'], [AccountProductName.Customer], 'asdfasdf')).toBeTruthy()
  })
  it('returns true if has roles', () => {
    const tests: [Route, string[]][] = [
      [new Route('/test1', ['1', '2', '3']), ['1']],
      [new Route('/test2', ['1', '2', '3']), ['1', '3']],
      [new Route('/test1', ['1']), ['1', '2']],
    ]
    tests.map(t => {
      expect(t[0].hasAccess(t[1], [AccountProductName.Customer])).toBeTruthy()
    })
  })
  it('returns false if does not have has roles', () => {
    const tests: [Route, string[]][] = [
      [new Route('/test1', ['1', '2', '3']), []],
      [new Route('/test2', ['1', '2', '3']), ['4', '5']],
      [new Route('/test1', ['1']), ['2']],
    ]
    tests.map(t => {
      expect(t[0].hasAccess(t[1])).toBeFalsy()
    })
  })
  it('returns false if user does not have feature', () => {
    const mock = jest.fn(() => false)
    ;(fm as Writable<typeof fm>).userHasFeature = mock
    const route = new Route('/test', undefined, 'testff')
    const roles = ['1']
    const products = [AccountProductName.Customer]
    const username = 'testuser'
    const result = route.hasAccess(roles, products, username)
    expect(mock).toHaveBeenCalledWith({ roles, username }, 'testff')
    expect(result).toBeFalsy()
  })
  it('returns true if user has feature', () => {
    const mock = jest.fn(() => true)
    ;(fm as Writable<typeof fm>).userHasFeature = mock
    const route = new Route('/test', ['1'], 'testff')
    const roles = ['1']
    const products = [AccountProductName.Customer]
    const username = 'testuser'
    const result = route.hasAccess(roles, products, username)
    expect(mock).toHaveBeenCalledWith({ roles, username }, 'testff')
    expect(result).toBeTruthy()
  })

  it('returns false if user has feature but not right roles', () => {
    const mock = jest.fn(() => true)
    ;(fm as Writable<typeof fm>).userHasFeature = mock
    const route = new Route('/test', ['2'], 'testff')
    const roles = ['1']
    const products = [AccountProductName.Customer]
    const username = 'testuser'
    const result = route.hasAccess(roles, products, username)
    expect(mock).toHaveBeenCalledWith({ roles, username }, 'testff')
    expect(result).toBeFalsy()
  })
})
