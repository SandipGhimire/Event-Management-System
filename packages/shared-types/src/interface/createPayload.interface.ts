export interface CreateAttendeePayload {
  name: string;
  email: string;
  phoneNumber: string;
  clubName: string;
  membershipID?: number;
  isVeg: boolean;
  position: string;
  profilePicture?: any;
  paymentSlip?: any;
}
export interface CreateSponsorPayload {
  name: string;
  email: string;
  phoneNumber: string;
  logo: string;
  description?: string;
  contribution?: string;
  isActive: boolean;
  order?: number;
  links: { label: string; url: string }[];
}
