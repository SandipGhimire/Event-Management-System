import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateTaskPayload } from "shared-types";
import { Transform } from "class-transformer";
import { IsUnique } from "../prisma/validator/UniqueValidator.decorator";

export class TaskCreateDto implements CreateTaskPayload {
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @IsUnique("task", "name", { message: "Name already exists" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "Slug is required" })
  @IsUnique("task", "slug", { message: "Slug already exists" })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  order?: number;
}

export class TaskUpdateDto extends TaskCreateDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  id?: number;
}
