import { registerDecorator, ValidatorOptions } from "class-validator";
import { IsUniqueConstraint } from "./UniqueValidator.validator";

interface customIsUniqueValidationArguments extends ValidatorOptions {
  message?: string;
}

export function IsUnique(model: string, column: string, validationOptions?: customIsUniqueValidationArguments) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isUnique",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model, column],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
}
