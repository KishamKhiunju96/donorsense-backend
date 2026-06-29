export enum UserRole {
  ADMIN  = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE   = 'active',
  INACTIVE = 'inactive',
  BANNED   = 'banned',
}

export const USER_ERRORS = {
  NOT_FOUND:    'User not found',
  EMAIL_EXISTS: 'A user with this email already exists',
  UNAUTHORIZED: 'You do not have permission to perform this action',
} as const;
