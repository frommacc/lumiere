-- CreateEnum. The guarded form lets this migration recover safely if a
-- previous deployment stopped after PostgreSQL had already created the enum.
DO $$
BEGIN
    CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "table" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "tableTypeId" TEXT NOT NULL,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "working_hours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isWorking" BOOLEAN NOT NULL DEFAULT true,
    "slots" JSONB NOT NULL,

    CONSTRAINT "working_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "schedule_override" (
    "id" TEXT NOT NULL,
    "dateString" TEXT NOT NULL,
    "isWorking" BOOLEAN NOT NULL,
    "slots" JSONB NOT NULL,
    "reason" TEXT,

    CONSTRAINT "schedule_override_pkey" PRIMARY KEY ("id")
);

-- The physical-table seed uses number as its stable natural key.
CREATE UNIQUE INDEX IF NOT EXISTS "table_number_key" ON "table"("number");
CREATE UNIQUE INDEX IF NOT EXISTS "working_hours_dayOfWeek_key" ON "working_hours"("dayOfWeek");

-- Add the new reservation fields as nullable first so existing reservations can
-- be safely assigned a physical table and an interval before enforcing NOT NULL.
ALTER TABLE "reservation"
    ADD COLUMN IF NOT EXISTS "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS "startTime" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "endTime" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "tableId" TEXT;

-- Seed ten physical tables. The statement is idempotent and also works when
-- the table-type rows were inserted before this migration.
INSERT INTO "table" ("id", "number", "capacity", "tableTypeId")
SELECT seed."id", seed."number", seed."capacity", table_type."id"
FROM (
    VALUES
        ('tbl_standard_01', 'M1', 4, 'standard'),
        ('tbl_standard_02', 'M2', 4, 'standard'),
        ('tbl_standard_03', 'M3', 4, 'standard'),
        ('tbl_standard_04', 'M4', 4, 'standard'),
        ('tbl_window_01', 'P1', 4, 'window'),
        ('tbl_window_02', 'P2', 4, 'window'),
        ('tbl_window_03', 'P3', 4, 'window'),
        ('tbl_vip_01', 'V1', 8, 'vip_lounge'),
        ('tbl_outdoor_01', 'T1', 6, 'outdoor'),
        ('tbl_outdoor_02', 'T2', 6, 'outdoor')
) AS seed("id", "number", "capacity", "slug")
JOIN "table_type" AS table_type ON table_type."slug" = seed."slug"
ON CONFLICT ("number") DO UPDATE
SET "capacity" = EXCLUDED."capacity", "tableTypeId" = EXCLUDED."tableTypeId";

-- The previous schema stored a restaurant-local date as a UTC timestamp plus
-- a separate HH:mm field. Convert it into UTC interval timestamps in Skopje.
UPDATE "reservation" AS reservation
SET
    "startTime" = (
        (((reservation."date" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Skopje')::date + reservation."time"::time)
            AT TIME ZONE 'Europe/Skopje') AT TIME ZONE 'UTC'
    ),
    "endTime" = (
        (((reservation."date" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Skopje')::date + reservation."time"::time)
            AT TIME ZONE 'Europe/Skopje') AT TIME ZONE 'UTC'
    ) + INTERVAL '90 minutes',
    "tableId" = (
        SELECT restaurant_table."id"
        FROM "table" AS restaurant_table
        WHERE restaurant_table."tableTypeId" = reservation."tableTypeId"
          AND restaurant_table."capacity" >= reservation."guests"
        ORDER BY restaurant_table."capacity" ASC, restaurant_table."number" ASC
        LIMIT 1
    );

ALTER TABLE "reservation"
    ALTER COLUMN "startTime" SET NOT NULL,
    ALTER COLUMN "endTime" SET NOT NULL,
    ALTER COLUMN "tableId" SET NOT NULL;

-- Schedule data is an array of local-time service windows:
-- [{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]
-- dayOfWeek follows JavaScript's convention: 0 is Sunday and 6 is Saturday.
INSERT INTO "working_hours" ("id", "dayOfWeek", "isWorking", "slots")
VALUES
    ('00000000-0000-4000-8000-000000000000', 0, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]'),
    ('00000000-0000-4000-8000-000000000001', 1, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]'),
    ('00000000-0000-4000-8000-000000000002', 2, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]'),
    ('00000000-0000-4000-8000-000000000003', 3, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]'),
    ('00000000-0000-4000-8000-000000000004', 4, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"22:30"}]'),
    ('00000000-0000-4000-8000-000000000005', 5, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"23:30"}]'),
    ('00000000-0000-4000-8000-000000000006', 6, true, '[{"start":"12:00","end":"15:00"},{"start":"18:00","end":"23:30"}]')
ON CONFLICT ("dayOfWeek") DO UPDATE
SET "isWorking" = EXCLUDED."isWorking", "slots" = EXCLUDED."slots";

-- Remove denormalized columns once all existing data has been migrated.
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_tableTypeId_fkey";
ALTER TABLE "reservation"
    DROP COLUMN "date",
    DROP COLUMN "time",
    DROP COLUMN "tableTypeId";
ALTER TABLE "table_type" DROP COLUMN "capacity";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "table_tableTypeId_capacity_idx" ON "table"("tableTypeId", "capacity");
CREATE UNIQUE INDEX IF NOT EXISTS "schedule_override_dateString_key" ON "schedule_override"("dateString");
CREATE INDEX IF NOT EXISTS "reservation_tableId_startTime_endTime_idx" ON "reservation"("tableId", "startTime", "endTime");
CREATE INDEX IF NOT EXISTS "reservation_startTime_endTime_status_idx" ON "reservation"("startTime", "endTime", "status");
CREATE INDEX IF NOT EXISTS "reservation_userId_startTime_idx" ON "reservation"("userId", "startTime");

-- AddForeignKey
ALTER TABLE "table" ADD CONSTRAINT "table_tableTypeId_fkey" FOREIGN KEY ("tableTypeId") REFERENCES "table_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
