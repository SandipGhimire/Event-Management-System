import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsEmail } from "class-validator";
import { CreateSponsorPayload } from "shared-types";
import { Transform } from "class-transformer";
import { IsUnique } from "../prisma/validator/UniqueValidator.decorator";

export class SponsorCreateDto implements CreateSponsorPayload {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @IsUnique("sponsor", "name", { message: "Name already exists", excludeIdField: "id" })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email is required" })
  @IsUnique("sponsor", "email", { message: "Email already exists", excludeIdField: "id" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Phone number is required" })
  @IsUnique("sponsor", "phoneNumber", { message: "Phone number already exists", excludeIdField: "id" })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contribution?: string;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  order?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string"
      ? (JSON.parse(value) as { label: string; url: string }[])
      : (value as { label: string; url: string }[])
  )
  links: { label: string; url: string }[];
}

export class SponsorUpdateDto extends SponsorCreateDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  id?: number;
}
