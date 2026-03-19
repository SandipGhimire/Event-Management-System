import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Api's List")
    .setDescription("All the available Aapi of the project")
    .setVersion("1.0")
    .addTag("api")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.reduce((accumulator, error) => {
          const message = Object.values(error.constraints ?? {});
          return {
            ...accumulator,
            [error.property]: message,
          };
        }, {});
        return new BadRequestException({ error: errors });
      },
    })
  );

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
