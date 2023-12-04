-- CreateTable
CREATE TABLE "scheme_transaction" (
    "id" SERIAL NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "aadhaarReferenceNumber" TEXT NOT NULL,
    "uniqueBeneficiaryId" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "transactionAmount" INTEGER NOT NULL,
    "inKindBenefitDetail" TEXT NOT NULL,
    "transactionDate" TEXT NOT NULL,
    "remarks" TEXT,
    "departmentData" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "scheme_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_history_table" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requestBody" JSONB[],
    "containErrors" BOOLEAN NOT NULL DEFAULT false,
    "validRecordsSaved" BOOLEAN NOT NULL DEFAULT false,
    "errors" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionStartTime" TIMESTAMP(3) NOT NULL,
    "transactionEndTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_history_table_pkey" PRIMARY KEY ("id")
);
