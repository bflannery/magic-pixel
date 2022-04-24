import { UserRoleType } from '../../gql-global'

export const ROLES = [
  {
    id: '1',
    value: UserRoleType.Admin,
    name: 'Admin',
  },
  {
    id: '2',
    value: UserRoleType.Owner,
    name: 'Owner',
  },
  {
    id: '3',
    value: UserRoleType.Main,
    name: 'User',
  },
]

export const AVAILABLE_ROLES = [ROLES[1], ROLES[2]]
export const OWNER_ROLES = [ROLES[1].value, ROLES[2].value]
export const USER_ROLES = [ROLES[2].value]
