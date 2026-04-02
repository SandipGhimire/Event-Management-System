/*
  Warnings:

  - You are about to drop the `SystemLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "log_types" AS ENUM ('SYSTEM', 'USER');

-- CreateEnum
CREATE TYPE "action_types" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'OTHER');

-- CreateEnum
CREATE TYPE "log_levels" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG', 'CRITICAL');

-- DropTable
DROP TABLE "SystemLog";

-- DropEnum
DROP TYPE "ActionType";

-- DropEnum
DROP TYPE "LogLevel";

-- DropEnum
DROP TYPE "LogType";

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "type" "log_types" NOT NULL,
    "action" "action_types",
    "userId" TEXT,
    "level" "log_levels",
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);
