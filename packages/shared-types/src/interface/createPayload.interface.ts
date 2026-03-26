export interface CreateAttendeePayload {
  name: string;
  email: string;
  phoneNumber: string;
  clubName: string;
  membershipID?: number;
  isVeg: boolean;
  position: string;
  profilePicture?: any;
}
