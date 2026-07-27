-- Existing testimonials were already curated before moderation was introduced.
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "review"
    ADD COLUMN "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED';

ALTER TABLE "review"
    ALTER COLUMN "status" SET DEFAULT 'PENDING';

CREATE INDEX "review_status_createdAt_idx" ON "review"("status", "createdAt");
