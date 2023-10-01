import { UtilsService } from './utils.service';
import { CreateVillageDto } from './dto/util.dto';
export declare class UtilsController {
    private readonly utilService;
    constructor(utilService: UtilsService);
    getVillageData(page: string, limit: string): Promise<any | null>;
    getVillageById(id: number): Promise<any>;
    addVillage(data: CreateVillageDto): Promise<any>;
}
