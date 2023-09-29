/*
  Warnings:

  - You are about to drop the `SubmissionData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubmissionTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubmissionTest" DROP CONSTRAINT "SubmissionTest_submissionDataId_fkey";

-- DropTable
DROP TABLE "SubmissionData";

-- DropTable
DROP TABLE "SubmissionTest";
