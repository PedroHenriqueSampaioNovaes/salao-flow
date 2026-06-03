/*
  Warnings:

  - You are about to drop the column `is_working_day` on the `EmployeeScheduleWeekday` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeScheduleWeekday" DROP COLUMN "is_working_day",
ADD COLUMN     "isWorkingDay" BOOLEAN NOT NULL DEFAULT true;
