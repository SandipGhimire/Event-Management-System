import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "../../database/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaModelDelegate = {
  deleteMany: () => Promise<unknown>;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      host: config.get<string>("DATABASE_HOST"),
      port: config.get<number>("DATABASE_PORT"),
      user: config.get<string>("DATABASE_USER"),
      password: config.get<string>("DATABASE_PASSWORD"),
      database: config.get<string>("DATABASE_NAME"),
    });
    super({
      adapter,
    });

    if (process.env.ENVIRONMENT === "development") {
      this.$on("query" as never, (e: { query: any; duration: any }) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Successfully connected to database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Disconnected from database");
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cannot clean database in production");
    }

    const modelDelegates = Object.values(this).filter(
      (value): value is PrismaModelDelegate =>
        typeof value === "object" &&
        value !== null &&
        "deleteMany" in value &&
        typeof (value as PrismaModelDelegate).deleteMany === "function"
    );

    await Promise.all(modelDelegates.map((model) => model.deleteMany()));
  }
}
