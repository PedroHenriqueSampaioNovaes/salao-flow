/*
  Warnings:

  - You are about to drop the column `employeeId` on the `ScheduleBlock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScheduleBlock" DROP CONSTRAINT "ScheduleBlock_employeeId_fkey";

-- AlterTable
ALTER TABLE "ScheduleBlock" DROP COLUMN "employeeId";

-- CreateTable
CREATE TABLE "_EmployeeToScheduleBlock" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeToScheduleBlock_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EmployeeToScheduleBlock_B_index" ON "_EmployeeToScheduleBlock"("B");

-- AddForeignKey
ALTER TABLE "_EmployeeToScheduleBlock" ADD CONSTRAINT "_EmployeeToScheduleBlock_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToScheduleBlock" ADD CONSTRAINT "_EmployeeToScheduleBlock_B_fkey" FOREIGN KEY ("B") REFERENCES "ScheduleBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
