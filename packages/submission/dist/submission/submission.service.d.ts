import { PrismaService } from 'src/prisma/prisma.service';
import { Submission, Prisma } from '@prisma/client';
export declare class SubmissionService {
    private prisma;
    constructor(prisma: PrismaService);
    createSubmission(data: Prisma.SubmissionCreateInput): Promise<Submission>;
    getAllSubmissions(): Promise<Submission[]>;
    getSubmissionById(id: number): Promise<Submission | null>;
    updateSubmission(id: number, data: Prisma.SubmissionUpdateInput): Promise<Submission | null>;
    deleteSubmission(id: number): Promise<Submission | null>;
}
