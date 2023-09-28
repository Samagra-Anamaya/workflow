import { SubmissionService } from './submission.service';
import { Submission } from '@prisma/client';
export declare class SubmissionController {
    private submissionService;
    constructor(submissionService: SubmissionService);
    createSubmission(data: any): Promise<any>;
    getAllSubmissions(): Promise<any>;
    getSubmissionByVillageId(id: number): Promise<any>;
    getSubmissionByCitizenId(id: string): Promise<any>;
    updateSubmission(id: number, data: any): Promise<Submission | null>;
    deleteSubmission(id: number): Promise<any>;
}
