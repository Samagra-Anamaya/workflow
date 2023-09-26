import { PrismaService } from '../prisma/prisma.service';
export declare class UtilsController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getVillageData(limit: any): Promise<any | null>;
    uploadCSV(): Promise<void>;
}
