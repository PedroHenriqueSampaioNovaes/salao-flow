/*
  Warnings:

  - You are about to drop the column `finalTime` on the `ScheduleBlock` table. All the data in the column will be lost.
  - You are about to drop the column `initialTime` on the `ScheduleBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScheduleBlock" DROP COLUMN "finalTime",
DROP COLUMN "initialTime";
