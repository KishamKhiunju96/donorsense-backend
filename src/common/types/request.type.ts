import type { Request } from 'express';

// Extends Express Request to include the authenticated user
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id:    string;
  email: string;
  role:  string;
}

export interface JwtPayload {
  sub:   string;   // user ID
  email: string;
  role:  string;
  iat:   number;
  exp:   number;
}
