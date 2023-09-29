-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'VERIFIED', 'PROCESSING', 'FAILED');

-- CreateEnum
CREATE TYPE "defaultPassword" AS ENUM ('ABCD');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'CANCEL', 'DONE', 'PROCESSING');

-- CreateEnum
CREATE TYPE "VillageDataStatus" AS ENUM ('ASSIGNED', 'COMPLETED', 'PROCESSING', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "TspBlockStatus" AS ENUM ('Y', 'N');

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "submitterId" TEXT NOT NULL,
    "submissionData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "spdpVillageId" INTEGER NOT NULL DEFAULT 0,
    "citizenId" TEXT,
    "errors" JSONB,
    "meta" JSONB,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionTest" (
    "id" SERIAL NOT NULL,
    "submitterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "spdpVillageId" INTEGER NOT NULL DEFAULT 0,
    "citizenId" TEXT,
    "errors" JSONB,
    "meta" JSONB,
    "submissionDataId" INTEGER NOT NULL,

    CONSTRAINT "SubmissionTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "SubmissionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT,
    "meta" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "surveyAssigned" INTEGER NOT NULL DEFAULT 0,
    "surveyCompleted" INTEGER NOT NULL DEFAULT 0,

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
    "locationId" INTEGER NOT NULL,
    "meta" JSONB,
    "assignerId" UUID NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VillageData" (
    "id" INTEGER NOT NULL,
    "stateCode" INTEGER NOT NULL,
    "stateName" TEXT NOT NULL,
    "districtCode" INTEGER NOT NULL,
    "districtName" TEXT NOT NULL,
    "itdaName" TEXT NOT NULL,
    "blockCode" INTEGER NOT NULL,
    "blockName" TEXT NOT NULL,
    "isTspBlock" TEXT NOT NULL,
    "gpCode" INTEGER NOT NULL,
    "gpName" TEXT NOT NULL,
    "surveySubmitted" INTEGER NOT NULL DEFAULT 0,
    "surveyToConduct" INTEGER NOT NULL DEFAULT 0,
    "spdpVillageId" INTEGER NOT NULL,
    "villageName" TEXT NOT NULL,
    "meta" JSONB,
    "submissions" JSONB,
    "status" "VillageDataStatus" NOT NULL DEFAULT 'UNASSIGNED',

    CONSTRAINT "VillageData_pkey" PRIMARY KEY ("spdpVillageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_mobile_key" ON "Admin"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VillageData_spdpVillageId_key" ON "VillageData"("spdpVillageId");

-- AddForeignKey
ALTER TABLE "SubmissionTest" ADD CONSTRAINT "SubmissionTest_submissionDataId_fkey" FOREIGN KEY ("submissionDataId") REFERENCES "SubmissionData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "VillageData"("spdpVillageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "Admin"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
