/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_AppointmentToService` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_A_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Appointment_id_seq";

-- AlterTable
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_AppointmentToService_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_AppointmentToService" ADD CONSTRAINT "_AppointmentToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
