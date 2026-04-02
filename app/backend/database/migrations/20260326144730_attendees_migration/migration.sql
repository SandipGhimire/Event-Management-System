/*
  Warnings:

  - Made the column `phoneNumber` on table `attendee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clubName` on table `attendee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isVeg` on table `attendee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attendee" ADD COLUMN     "position" TEXT,
ALTER COLUMN "phoneNumber" SET NOT NULL,
ALTER COLUMN "clubName" SET NOT NULL,
ALTER COLUMN "isVeg" SET NOT NULL;
