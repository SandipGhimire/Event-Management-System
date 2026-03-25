/*
  Warnings:

  - You are about to drop the `Attendee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttendeeTaskLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendeeTaskLog" DROP CONSTRAINT "AttendeeTaskLog_attendeeId_fkey";

-- DropForeignKey
ALTER TABLE "AttendeeTaskLog" DROP CONSTRAINT "AttendeeTaskLog_taskId_fkey";

-- DropTable
DROP TABLE "Attendee";

-- DropTable
DROP TABLE "AttendeeTaskLog";

-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "attendee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePic" TEXT,
    "clubName" TEXT,
    "membershipID" TEXT,
    "isVeg" BOOLEAN,
    "qrCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendee_task_log" (
    "id" SERIAL NOT NULL,
    "attendeeId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "scannedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendee_task_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendee_email_key" ON "attendee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "attendee_phoneNumber_key" ON "attendee"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "attendee_membershipID_key" ON "attendee"("membershipID");

-- CreateIndex
CREATE UNIQUE INDEX "attendee_qrCode_key" ON "attendee"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "task_slug_key" ON "task"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendee_task_log_attendeeId_taskId_key" ON "attendee_task_log"("attendeeId", "taskId");

-- AddForeignKey
ALTER TABLE "attendee_task_log" ADD CONSTRAINT "attendee_task_log_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendee_task_log" ADD CONSTRAINT "attendee_task_log_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
