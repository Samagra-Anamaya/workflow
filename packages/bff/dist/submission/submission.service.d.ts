import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SubmissionService {
    private prisma;
    constructor(prisma: PrismaService);
    createSubmission(data: Prisma.SubmissionCreateInput): Promise<any>;
    getSubmissions(page: number, pageSize: number): Promise<{
        result: {
            submissions: {
                id: number;
                submitterId: string;
                submissionData: Prisma.JsonValue;
                createdAt: Date;
                capturedAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.SubmissionStatus;
                spdpVillageId: number;
                citizenId: string;
                errors: Prisma.JsonValue;
                meta: Prisma.JsonValue;
            }[];
            totalCount: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    getSubmissionByVillageId(id: number, page: number, pageSize: number): Promise<any>;
    getSubmissionByCitizenId(id: string): Promise<any>;
    updateSubmission(id: number, data: Prisma.SubmissionUpdateInput): Promise<any>;
    deleteSubmission(id: number): Promise<any>;
}
