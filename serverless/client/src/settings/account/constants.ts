import { UserRoleType } from '../../gql-global'

export const ROLES = [
  {
    id: '1',
    value: UserRoleType.Main,
    name: 'User',
  },
  {
    id: '2',
    value: UserRoleType.Owner,
    name: 'Owner',
  },
  {
    id: '3',
    value: UserRoleType.Admin,
    name: 'Admin',
  },
]

export const AVAILABLE_ROLES = [ROLES[0], ROLES[1]]
export const OWNER_ROLES = [ROLES[0].value, ROLES[1].value]
export const USER_ROLES = [ROLES[0].value]
