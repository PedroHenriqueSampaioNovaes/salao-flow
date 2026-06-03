/*
  Warnings:

  - You are about to drop the column `operatingTimeId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `OperatingTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OperatingTimeWeekday` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employeeScheduleId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_operatingTimeId_fkey";

-- DropForeignKey
ALTER TABLE "OperatingTime" DROP CONSTRAINT "OperatingTime_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "OperatingTimeWeekday" DROP CONSTRAINT "OperatingTimeWeekday_operatingTimeId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "operatingTimeId",
ADD COLUMN     "employeeScheduleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "OperatingTime";

-- DropTable
DROP TABLE "OperatingTimeWeekday";

-- CreateTable
CREATE TABLE "EmployeeSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "barbershopId" INTEGER NOT NULL,

    CONSTRAINT "EmployeeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeScheduleWeekday" (
    "id" TEXT NOT NULL,
    "employeeScheduleId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start" TEXT,
    "startLunch" TEXT,
    "endLunch" TEXT,
    "end" TEXT,

    CONSTRAINT "EmployeeScheduleWeekday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeScheduleWeekday_weekday_employeeScheduleId_key" ON "EmployeeScheduleWeekday"("weekday", "employeeScheduleId");

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeScheduleWeekday" ADD CONSTRAINT "EmployeeScheduleWeekday_employeeScheduleId_fkey" FOREIGN KEY ("employeeScheduleId") REFERENCES "EmployeeSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_employeeScheduleId_fkey" FOREIGN KEY ("employeeScheduleId") REFERENCES "EmployeeSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
