import { PrismaService } from 'src/prisma/prisma.service';
export declare class UtilsService {
    private prisma;
    constructor(prisma: PrismaService);
    getVillageById(id: number): Promise<any>;
    addVillage(data: any): Promise<any>;
    getVillages(page: number, pageSize: number): Promise<{
        result: {
            villages: {
                id: number;
                stateCode: number;
                stateName: string;
                districtCode: number;
                districtName: string;
                itdaName: string;
                blockCode: number;
                blockName: string;
                isTspBlock: string;
                gpCode: number;
                gpName: string;
                surveySubmitted: number;
                surveyToConduct: number;
                spdpVillageId: number;
                villageName: string;
                meta: import(".prisma/client").Prisma.JsonValue;
                submissions: import(".prisma/client").Prisma.JsonValue;
                status: import(".prisma/client").$Enums.VillageDataStatus;
            }[];
            totalCount: number;
            currentPage: number;
            totalPages: number;
        };
    }>;
}
