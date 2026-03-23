declare global {
  namespace Express {
    interface User {
      userId: number;
      userUUID: string;
      email: string;
      username: string;
      sessionId: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
