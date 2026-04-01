import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { CreateAttendeePayload } from "shared-types";
import { Transform } from "class-transformer";
import { IsUnique } from "../prisma/validator/UniqueValidator.decorator";

export class AttendeeCreateDto implements CreateAttendeePayload {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  id?: number;

  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  @IsUnique("attendee", "email", { message: "Email already exists", excludeIdField: "id" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^9[78]\d{8}$/, { message: "Phone number must be a valid 10-digit number starting with 97 or 98" })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: "Club name is required" })
  clubName: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  membershipID?: number;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isVeg: boolean;

  @IsString()
  @IsNotEmpty({ message: "Position is required" })
  position: string;

  @IsOptional()
  paymentSlip?: any;
}
