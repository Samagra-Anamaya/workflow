import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const retryOptions = {
//   initialInterval: 1000, // Initial retry interval in milliseconds
//   maximumAttempts: 3, // Maximum number of retry attempts
// };

export async function submissionWorkflow(data: any): Promise<void> {
  console.log({ data });
  let result;
  try {
    // Execute your database query here

    result = await prisma.submission.findMany({});
    console.log({ result });
    // Your workflow logic here, process the result
  } catch (error) {
    // Handle the error, you can log it or perform custom logic
    console.error(`Database query failed: ${error.message}`);
    throw error; // Rethrow the error to trigger retries
  }

  // If the query succeeded, return the result
  return result;
}
