-- Remove FREE plan (single-plan system going forward)
ALTER TYPE "Plan" RENAME TO "Plan_old";
CREATE TYPE "Plan" AS ENUM ('PROFISSIONAL');
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "Plan" USING ("plan"::text::"Plan");
DROP TYPE "Plan_old";

-- Add subscription tracking fields
ALTER TABLE "Subscription" ADD COLUMN "subscriptionId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN "trialEndsAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");
