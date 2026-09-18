-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isRecruiter" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Barbershop_isRecruiter_expiresAt_idx" ON "Barbershop"("isRecruiter", "expiresAt");
