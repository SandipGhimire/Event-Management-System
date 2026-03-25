/*
  Warnings:

  - You are about to drop the `Sponsor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SponsorLink" DROP CONSTRAINT "SponsorLink_sponsorId_fkey";

-- DropTable
DROP TABLE "Sponsor";

-- DropTable
DROP TABLE "SponsorLink";

-- CreateTable
CREATE TABLE "sponsors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "contribution" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors_link" (
    "id" SERIAL NOT NULL,
    "sponsorId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsors_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_name_key" ON "sponsors"("name");

-- AddForeignKey
ALTER TABLE "sponsors_link" ADD CONSTRAINT "sponsors_link_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
