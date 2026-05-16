/*
  Warnings:

  - You are about to drop the column `barbershopId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_barbershopId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "barbershopId",
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
