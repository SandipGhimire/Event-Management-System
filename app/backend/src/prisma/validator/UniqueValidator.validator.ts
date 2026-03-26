import { Injectable, Logger } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { PrismaService } from "../prisma.service";

interface customIsUniqueValidationArguments extends ValidationArguments {
  message?: string;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  private readonly logger = new Logger(IsUniqueConstraint.name);

  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: customIsUniqueValidationArguments) {
    const constraints = args.constraints as [string, string];

    const [modelName, fieldName] = constraints;
    try {
      const model = (this.prisma as unknown as Record<string, any>)[modelName] as {
        findFirst: (options: { where: Record<string, unknown> }) => Promise<unknown>;
      };

      if (!model) {
        this.logger.error(`Model ${modelName} not found in PrismaService`);
        return false;
      }

      const record = await model.findFirst({
        where: { [fieldName]: value as unknown },
      });

      return !record;
    } catch (error) {
      this.logger.error(`Error validating uniqueness for ${fieldName} in ${modelName}: ${error}`);
      return false;
    }
  }

  defaultMessage(args: customIsUniqueValidationArguments) {
    const constraints = args.constraints as [string, string];
    const [modelName, fieldName] = constraints;
    return args.message || `${fieldName} must be unique in ${modelName}`;
  }
}
