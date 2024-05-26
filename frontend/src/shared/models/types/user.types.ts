

export interface User {
  user_id: number
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  roles: Role[]
}

export interface Role {
  role_id: string
  role_name: string
}