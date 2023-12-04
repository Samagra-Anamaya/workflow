-- CreateTable
CREATE TABLE "scheme_transaction" (
    "id" SERIAL NOT NULL,
    "scheme_code" TEXT NOT NULL,
    "aadhaar_number" VARCHAR(12) NOT NULL,
    "aadhaar_reference_number" VARCHAR(13) NOT NULL,
    "unique_beneficiary_id" VARCHAR(127) NOT NULL,
    "financial_year" VARCHAR(15) NOT NULL,
    "transaction_type" VARCHAR(127) NOT NULL,
    "transaction_amount" INTEGER NOT NULL,
    "in_kind_benefit_detail" VARCHAR(127) NOT NULL,
    "transaction_date" VARCHAR(15) NOT NULL,
    "remarks" TEXT,
    "department_data" JSONB,
    "user_id" UUID NOT NULL,

    CONSTRAINT "scheme_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_history_table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "request_body" JSONB[],
    "total_records" INTEGER NOT NULL,
    "valid_records" INTEGER NOT NULL,
    "invalid_records" INTEGER NOT NULL,
    "contain_errors" BOOLEAN NOT NULL DEFAULT false,
    "valid_records_saved" BOOLEAN NOT NULL DEFAULT false,
    "errors" JSONB NOT NULL,
    "user_id" UUID NOT NULL,
    "transaction_start_time" TIMESTAMP(3) NOT NULL,
    "transaction_end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_history_table_pkey" PRIMARY KEY ("id")
);
