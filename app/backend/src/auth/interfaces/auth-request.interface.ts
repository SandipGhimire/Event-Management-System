import { Request } from "express";

export interface AuthenticatedUser {
  userId: number;
  userUUID: string;
  email: string;
  username: string;
  sessionId: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
