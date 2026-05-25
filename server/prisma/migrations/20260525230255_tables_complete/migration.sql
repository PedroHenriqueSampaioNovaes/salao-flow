/*
  Warnings:

  - You are about to drop the column `times` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `email` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operationId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PROFISSIONAL');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "serviceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "times",
ADD COLUMN     "operationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "priceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barbershopId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatingTime" (
    "id" SERIAL NOT NULL,
    "inicio" TEXT NOT NULL,
    "inicioAlmoco" TEXT NOT NULL,
    "fimAlmoco" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "barbershopId" INTEGER NOT NULL,

    CONSTRAINT "OperatingTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barbershopId" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EmployeeToService" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EmployeeToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AppointmentToService" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppointmentToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_barbershopId_key" ON "Subscription"("barbershopId");

-- CreateIndex
CREATE INDEX "_EmployeeToService_B_index" ON "_EmployeeToService"("B");

-- CreateIndex
CREATE INDEX "_AppointmentToService_B_index" ON "_AppointmentToService"("B");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatingTime" ADD CONSTRAINT "OperatingTime_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "OperatingTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToService" ADD CONSTRAINT "_AppointmentToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToService" ADD CONSTRAINT "_AppointmentToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
