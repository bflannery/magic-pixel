export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: Date
}

export type AccountFilterInput = {
  search?: Maybe<KeywordFilterInput>
}

export enum AccountSort {
  Name = 'NAME',
}

export type AccountType = {
  __typename: 'AccountType'
  createdAt: Scalars['DateTime']
  id: Scalars['Float']
  isActive: Scalars['Boolean']
  name: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
  users?: Maybe<Array<UserType>>
}

export type KeywordFilterInput = {
  keywords: Array<Scalars['String']>
}

export type Mutations = {
  __typename: 'Mutations'
  signupAccount?: Maybe<SignupAccount>
}

export type MutationsSignupAccountArgs = {
  industry?: Maybe<Scalars['String']>
  name: Scalars['String']
  title?: Maybe<Scalars['String']>
}

export type PagedAccountType = {
  __typename: 'PagedAccountType'
  cursor?: Maybe<Scalars['String']>
  results: Array<AccountType>
  total: Scalars['Int']
}

export type Query = {
  __typename: 'Query'
  account?: Maybe<AccountType>
  accounts?: Maybe<PagedAccountType>
  whoami?: Maybe<UserType>
}

export type QueryAccountArgs = {
  id: Scalars['ID']
}

export type QueryAccountsArgs = {
  cursor?: Maybe<Scalars['String']>
  limit?: Maybe<Scalars['Int']>
  sortBy?: Maybe<AccountSort>
  sortDirection?: Maybe<SortDirection>
  where?: Maybe<AccountFilterInput>
}

export type RoleType = {
  __typename: 'RoleType'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  name: Scalars['String']
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type SignupAccount = {
  __typename: 'SignupAccount'
  account?: Maybe<AccountType>
  ok?: Maybe<Scalars['Boolean']>
}

/** An enumeration. */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type UserPreferences = {
  __typename: 'UserPreferences'
  id: Scalars['ID']
}

export type UserType = {
  __typename: 'UserType'
  account?: Maybe<AccountType>
  accountId?: Maybe<Scalars['Float']>
  createdAt: Scalars['DateTime']
  deletedAt?: Maybe<Scalars['DateTime']>
  email: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  id: Scalars['Float']
  lastLoginAt?: Maybe<Scalars['DateTime']>
  lastName?: Maybe<Scalars['String']>
  preferences: UserPreferences
  roles?: Maybe<Array<RoleType>>
  updatedAt?: Maybe<Scalars['DateTime']>
}
