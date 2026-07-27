-- Store the planned sitting time explicitly. Existing reservations were created
-- with the original 90-minute policy and retain that duration.
ALTER TABLE "reservation"
    ADD COLUMN "durationMinutes" INTEGER NOT NULL DEFAULT 90;

-- TableType represents only the ambience/location. Capacity belongs exclusively
-- to each physical table, so the starter layout intentionally mixes capacities
-- within every ambience.
UPDATE "table" AS restaurant_table
SET
    "capacity" = layout."capacity",
    "tableTypeId" = table_type."id"
FROM (
    VALUES
        ('M1', 4, 'outdoor'),
        ('M2', 4, 'window'),
        ('M3', 2, 'standard'),
        ('M4', 6, 'standard'),
        ('P1', 4, 'window'),
        ('P2', 4, 'standard'),
        ('P3', 6, 'outdoor'),
        ('V1', 8, 'vip_lounge'),
        ('T1', 2, 'standard'),
        ('T2', 6, 'window')
) AS layout("number", "capacity", "slug")
JOIN "table_type" AS table_type ON table_type."slug" = layout."slug"
WHERE restaurant_table."number" = layout."number";
