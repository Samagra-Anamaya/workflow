import { SubmissionService } from './submission.service';
import { Submission } from '@prisma/client';
export declare class SubmissionController {
    private submissionService;
    constructor(submissionService: SubmissionService);
    createSubmission(data: any): Promise<Submission>;
    getAllSubmissions(): Promise<Submission[]>;
    getSubmissionById(id: number): Promise<Submission | null>;
    updateSubmission(id: number, data: any): Promise<Submission | null>;
    deleteSubmission(id: number): Promise<Submission | null>;
}
