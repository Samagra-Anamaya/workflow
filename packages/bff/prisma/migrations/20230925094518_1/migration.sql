-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'VERIFIED', 'PROCESSING', 'FAILED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'CANCEL', 'DONE', 'PROCESSING');

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "submitterId" TEXT NOT NULL,
    "submissionData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "errors" JSONB,
    "meta" JSONB,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "surveyAssigned" INTEGER NOT NULL DEFAULT 0,
    "surveyCompleted" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mobile" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "meta" JSONB,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enumeratorId" TEXT NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "formId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "meta" JSONB,
    "assignerId" UUID NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VillageData" (
    "villageLGDCode" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "tehsilName" TEXT NOT NULL,
    "riCircleName" TEXT NOT NULL,
    "villageName" TEXT NOT NULL,
    "distLGDCode" TEXT NOT NULL,
    "blockLGDCode" TEXT NOT NULL,
    "gplgdCode" TEXT NOT NULL,
    "spdpVillageId" TEXT NOT NULL,

    CONSTRAINT "VillageData_pkey" PRIMARY KEY ("spdpVillageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_mobile_key" ON "Admin"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VillageData_spdpVillageId_key" ON "VillageData"("spdpVillageId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "VillageData"("spdpVillageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "Admin"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
