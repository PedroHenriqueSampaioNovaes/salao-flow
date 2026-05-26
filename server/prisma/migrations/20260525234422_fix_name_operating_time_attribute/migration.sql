/*
  Warnings:

  - You are about to drop the column `operationId` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `operatingTimeId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_operationId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "operationId",
ADD COLUMN     "operatingTimeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_operatingTimeId_fkey" FOREIGN KEY ("operatingTimeId") REFERENCES "OperatingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
