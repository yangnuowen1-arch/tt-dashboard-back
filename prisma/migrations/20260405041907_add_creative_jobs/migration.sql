-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "department" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creative_jobs" (
    "id" SERIAL NOT NULL,
    "job_id" VARCHAR(100) NOT NULL,
    "client_item_id" VARCHAR(100) NOT NULL,
    "file_name" VARCHAR(500) NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "size_bytes" BIGINT NOT NULL DEFAULT 0,
    "kind" VARCHAR(20) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'queued',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "object_key" VARCHAR(500) NOT NULL,
    "asset_url" VARCHAR(1000),
    "processed_url" VARCHAR(1000),
    "cover_url" VARCHAR(1000),
    "published_id" VARCHAR(100),
    "repair_config" JSONB,
    "error" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creative_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "idx_employees_email" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "creative_jobs_job_id_key" ON "creative_jobs"("job_id");

-- CreateIndex
CREATE INDEX "idx_creative_jobs_job_id" ON "creative_jobs"("job_id");

-- CreateIndex
CREATE INDEX "idx_creative_jobs_client_item_id" ON "creative_jobs"("client_item_id");
