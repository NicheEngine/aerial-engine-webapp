import type { RoleInfo } from '@mds/info/roleInfo.ts'

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  avatar: string
  desc?: string
  homePath?: string
  roles: RoleInfo[]
}
