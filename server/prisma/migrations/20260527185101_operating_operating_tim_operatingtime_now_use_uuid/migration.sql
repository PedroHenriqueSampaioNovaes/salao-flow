/*
  Warnings:

  - The primary key for the `OperatingTime` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_operatingTimeId_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "operatingTimeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OperatingTime" DROP CONSTRAINT "OperatingTime_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OperatingTime_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OperatingTime_id_seq";

-- CreateIndex
CREATE INDEX "Barbershop_slug_idx" ON "Barbershop"("slug");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_operatingTimeId_fkey" FOREIGN KEY ("operatingTimeId") REFERENCES "OperatingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
