import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { useContainer, ValidationError } from "class-validator";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Api's List")
    .setDescription("All the available Aapi of the project")
    .setVersion("1.0")
    .addTag("api")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, documentFactory);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
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

  const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(",") || [];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
