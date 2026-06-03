/*
  Warnings:

  - A unique constraint covering the columns `[weekday,operatingTimeId]` on the table `OperatingTimeWeekday` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OperatingTimeWeekday" DROP CONSTRAINT "OperatingTimeWeekday_operatingTimeId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "OperatingTimeWeekday_weekday_operatingTimeId_key" ON "OperatingTimeWeekday"("weekday", "operatingTimeId");

-- AddForeignKey
ALTER TABLE "OperatingTimeWeekday" ADD CONSTRAINT "OperatingTimeWeekday_operatingTimeId_fkey" FOREIGN KEY ("operatingTimeId") REFERENCES "OperatingTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
