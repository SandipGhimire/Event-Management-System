import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}

export class UserRequestDto {
  userId: number;
  userUUID: string;
  email: string;
  username: string;
  sessionId: string;
  permissions: string[];
}

export class RefreshTokenRequestDto {
  sub: string;
  email: string;
  sessionId: string;
  iat: string;
  exp: string;
  refreshToken: string;
}
