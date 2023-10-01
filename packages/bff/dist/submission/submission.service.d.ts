import { PrismaService } from 'src/prisma/prisma.service';
export declare class SubmissionService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService);
    createSubmission(data: any): Promise<any>;
    searchSubmissions(text: string): Promise<{
        id: string;
        submitterId: string;
        submissionData: import(".prisma/client").Prisma.JsonValue;
        createdAt: Date;
        capturedAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        spdpVillageId: number;
        citizenId: string;
        errors: import(".prisma/client").Prisma.JsonValue;
        meta: import(".prisma/client").Prisma.JsonValue;
    }[]>;
    getSubmissions(page: number, pageSize: number): Promise<{
        result: {
            submissions: {
                id: string;
                submitterId: string;
                submissionData: import(".prisma/client").Prisma.JsonValue;
                createdAt: Date;
                capturedAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.SubmissionStatus;
                spdpVillageId: number;
                citizenId: string;
                errors: import(".prisma/client").Prisma.JsonValue;
                meta: import(".prisma/client").Prisma.JsonValue;
            }[];
            totalCount: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
    getSubmissionByVillageId(id: number, page: number, pageSize: number): Promise<any>;
    getSubmissionByCitizenId(id: string): Promise<any>;
    updateSubmission(id: string, newdata: any): Promise<any>;
}
