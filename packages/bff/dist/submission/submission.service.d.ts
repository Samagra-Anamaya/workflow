import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class SubmissionService {
    private prisma;
    constructor(prisma: PrismaService);
    createSubmission(data: Prisma.SubmissionCreateInput): Promise<any>;
    getAllSubmissions(): Promise<any[]>;
    getSubmissionByVillageId(id: number): Promise<any>;
    getSubmissionByCitizenId(id: string): Promise<any>;
    updateSubmission(id: number, data: Prisma.SubmissionUpdateInput): Promise<any>;
    deleteSubmission(id: number): Promise<any>;
}
