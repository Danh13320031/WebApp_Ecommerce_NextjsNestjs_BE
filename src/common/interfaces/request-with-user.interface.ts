import { Request } from 'express';

export interface IRequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    // firstName: string;
    // lastName: string;
    // avatar: string | null;
    // isActive: boolean;
    // isDelete: boolean;
    role: string;
  };
}
