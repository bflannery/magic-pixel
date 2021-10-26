import { UserRoleType } from '../../gql-global'

export const ROLES = [
  {
    id: '1',
    value: UserRoleType.Main,
    name: 'User',
  },
  {
    id: '2',
    value: UserRoleType.Admin,
    name: 'Admin',
  },
  {
    id: '3',
    value: UserRoleType.Owner,
    name: 'Owner',
  },
]

export const AVAILABLE_ROLES = [ROLES[0], ROLES[3]]
export const OWNER_ROLES = [ROLES[0].value, ROLES[3].value]
export const USER_ROLES = [ROLES[0].value]
