-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "ScheduleBlock_initialDate_finalDate_idx" ON "ScheduleBlock"("initialDate", "finalDate");
