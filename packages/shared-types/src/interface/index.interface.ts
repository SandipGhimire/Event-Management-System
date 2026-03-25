export interface UserDetail {
  id: number;
  uuid: string;
  fullName: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  permissions: string[];
}

export interface AttendeesDetail {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  profilePic: string;
  clubName: string;
  membershipID: string;
  isVeg: boolean;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  logo: string;
  description: string;
  contribution: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDetail {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
