-- CreateTable
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: snapshot current Service data for existing Appointment<->Service links.
-- This is best-effort — the original relation never tracked historical price/duration,
-- so pre-existing appointments get today's service values, not what was charged at booking time.
INSERT INTO "AppointmentService" ("id", "name", "price", "duration", "appointmentId", "serviceId")
SELECT gen_random_uuid()::text, s."name", s."price", s."duration", ats."A", ats."B"
FROM "_AppointmentToService" ats
JOIN "Service" s ON s."id" = ats."B";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppointmentToService" DROP CONSTRAINT "_AppointmentToService_B_fkey";

-- DropTable
DROP TABLE "_AppointmentToService";
