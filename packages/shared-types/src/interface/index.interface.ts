export interface UserDetail {
  id?: number;
  uuid: string;
  fullName: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  permissions?: string[];
  roles?: {
    role?: {
      name?: string;
    };
  }[];
}

export interface AttendeesDetail {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  profilePic: string;
  paymentSlip: string;
  clubName: string;
  membershipID: string;
  isVeg: boolean;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorLinkDetail {
  id: number;
  label: string;
  url: string;
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
  links: SponsorLinkDetail[];
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
  permissions?: {
    permission: {
      key: string;
    };
  }[];
}

export interface TaskDetail {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
  slug: string;
  createdAt: string; // ISO date string
}
