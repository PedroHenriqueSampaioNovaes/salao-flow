/*
  Warnings:

  - You are about to drop the `AppointmentBlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AppointmentBlock" DROP CONSTRAINT "AppointmentBlock_barbershopId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentBlock" DROP CONSTRAINT "AppointmentBlock_employeeId_fkey";

-- DropTable
DROP TABLE "AppointmentBlock";

-- CreateTable
CREATE TABLE "AppointmentBlocking" (
    "id" TEXT NOT NULL,
    "initialDate" TIMESTAMP(3) NOT NULL,
    "finalDate" TIMESTAMP(3) NOT NULL,
    "initialTime" TEXT NOT NULL,
    "finalTime" TEXT NOT NULL,
    "barbershopId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "AppointmentBlocking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentBlocking_initialDate_idx" ON "AppointmentBlocking"("initialDate");

-- AddForeignKey
ALTER TABLE "AppointmentBlocking" ADD CONSTRAINT "AppointmentBlocking_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentBlocking" ADD CONSTRAINT "AppointmentBlocking_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
