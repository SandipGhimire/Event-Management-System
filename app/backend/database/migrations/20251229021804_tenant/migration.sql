-- CreateTable
CREATE TABLE "tenant_details" (
    "id" BIGSERIAL NOT NULL,
    "tenant_host" VARCHAR(255) NOT NULL,
    "db_host" VARCHAR(255) NOT NULL,
    "db_port" INTEGER NOT NULL DEFAULT 5432,
    "db_username" VARCHAR(255) NOT NULL,
    "db_password" VARCHAR(255) NOT NULL,
    "db_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_details_tenant_host_key" ON "tenant_details"("tenant_host");
