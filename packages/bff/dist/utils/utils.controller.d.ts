import { PrismaService } from '../prisma/prisma.service';
export declare class UtilsController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getVillageData(limit: any): Promise<any | null>;
    getSubmissionByCitizenId(id: number): Promise<any>;
    uploadVillageData(): Promise<any | null>;
}
