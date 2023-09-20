import { PrismaService } from '../prisma/prisma.service';
export declare class SubmissionController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    createSubmission(createSubmissionDto: {
        submitter: any;
        submissionData: any;
        meta: any;
        submitterId: string;
    }): Promise<{
        id: number;
        submitterId: string;
        submissionData: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
        verificationIntitaed: boolean;
        isUpdated: boolean;
        verificationDate: Date;
        isVerified: boolean;
        errors: import(".prisma/client").Prisma.JsonValue;
    }>;
}
