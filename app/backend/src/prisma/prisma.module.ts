import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { IsUniqueConstraint } from "./validator/UniqueValidator.validator";

@Global()
@Module({
  providers: [PrismaService, IsUniqueConstraint],
  exports: [PrismaService, IsUniqueConstraint],
})
export class PrismaModule {}
