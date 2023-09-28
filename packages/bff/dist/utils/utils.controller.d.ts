import { UtilsService } from './utils.service';
export declare class UtilsController {
    private readonly submissionService;
    constructor(submissionService: UtilsService);
    getSecureData(): string;
    getVillageData(page: string, limit: string): Promise<any | null>;
    getVillageById(id: number): Promise<any>;
    addVillage(data: any): Promise<any>;
}
