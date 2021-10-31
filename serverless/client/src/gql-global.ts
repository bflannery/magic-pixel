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

export type AccountType = Node & {
  __typename: 'AccountType'
  id: Scalars['ID']
  industry?: Maybe<Scalars['String']>
  isActive?: Maybe<Scalars['Boolean']>
  name?: Maybe<Scalars['String']>
  users?: Maybe<Array<UserType>>
}

export type CreateAccount = {
  __typename: 'CreateAccount'
  account?: Maybe<AccountType>
  ok?: Maybe<Scalars['Boolean']>
}

export type CreateUser = {
  __typename: 'CreateUser'
  ok?: Maybe<Scalars['Boolean']>
  user?: Maybe<UserType>
}

export type DeleteUser = {
  __typename: 'DeleteUser'
  ok?: Maybe<Scalars['Boolean']>
  user?: Maybe<UserType>
}

export type KeywordFilterInput = {
  keywords: Array<Scalars['String']>
}

export type Mutations = {
  __typename: 'Mutations'
  createAccount?: Maybe<CreateAccount>
  createUser?: Maybe<CreateUser>
  deleteUser?: Maybe<DeleteUser>
  resendUserEmail?: Maybe<ResendUserEmail>
  resendUserInvite?: Maybe<ResendUserInvite>
  updateUser?: Maybe<UpdateUser>
}

export type MutationsCreateAccountArgs = {
  industry?: Maybe<Scalars['String']>
  name: Scalars['String']
  title?: Maybe<Scalars['String']>
}

export type MutationsCreateUserArgs = {
  accountId: Scalars['ID']
  email: Scalars['String']
  roles?: Maybe<Array<UserRoleType>>
}

export type MutationsDeleteUserArgs = {
  userId: Scalars['ID']
}

export type MutationsResendUserInviteArgs = {
  userId: Scalars['ID']
}

export type MutationsUpdateUserArgs = {
  roles?: Maybe<Array<UserRoleType>>
  userId: Scalars['ID']
}

export type Node = {
  id: Scalars['ID']
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

export type ResendUserEmail = {
  __typename: 'ResendUserEmail'
  ok?: Maybe<Scalars['Boolean']>
}

export type ResendUserInvite = {
  __typename: 'ResendUserInvite'
  ok?: Maybe<Scalars['Boolean']>
}

export type RoleType = Node & {
  __typename: 'RoleType'
  id: Scalars['ID']
  name: Scalars['String']
}

/** An enumeration. */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type UpdateUser = {
  __typename: 'UpdateUser'
  ok?: Maybe<Scalars['Boolean']>
  user?: Maybe<UserType>
}

export type UserPreferences = {
  __typename: 'UserPreferences'
  id: Scalars['ID']
}

/** An enumeration. */
export enum UserRoleType {
  Admin = 'ADMIN',
  Main = 'MAIN',
  Owner = 'OWNER',
}

export type UserType = Node & {
  __typename: 'UserType'
  account: AccountType
  auth0Id?: Maybe<Scalars['String']>
  createdAt: Scalars['DateTime']
  email: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lastLoginAt?: Maybe<Scalars['DateTime']>
  lastName?: Maybe<Scalars['String']>
  preferences: UserPreferences
  roles: Array<RoleType>
}
