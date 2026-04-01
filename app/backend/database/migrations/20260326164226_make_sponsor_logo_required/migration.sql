/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `sponsors` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `sponsors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `sponsors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo` on table `sponsors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attendee" ADD COLUMN     "paymentSlip" TEXT;

-- Update NULLs to avoid failure
UPDATE "sponsors" SET "email" = 'pending_' || id || '@example.com' WHERE "email" IS NULL;
UPDATE "sponsors" SET "phoneNumber" = 'p_' || id WHERE "phoneNumber" IS NULL;
UPDATE "sponsors" SET "logo" = 'pending_logo.png' WHERE "logo" IS NULL;

-- AlterTable
ALTER TABLE "sponsors" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "logo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_email_key" ON "sponsors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_phoneNumber_key" ON "sponsors"("phoneNumber");
