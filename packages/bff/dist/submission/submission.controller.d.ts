import { SubmissionService } from './submission.service';
import { Submission } from '@prisma/client';
import { CreateSubmissionDto, GetAllSubmissionsDto, UpdateSubmissionDto } from './dto/submission.dto';
export declare class SubmissionController {
    private submissionService;
    private logger;
    constructor(submissionService: SubmissionService);
    createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<any>;
    getAllSubmissions(query: GetAllSubmissionsDto): Promise<any>;
    getSubmissionByVillageId(id: number, page: string, limit: string): Promise<any>;
    searchSubmission(name: string): Promise<any>;
    getSubmissionByCitizenId(id: string): Promise<any>;
    updateSubmission(id: string, data: UpdateSubmissionDto): Promise<Submission | null>;
}
