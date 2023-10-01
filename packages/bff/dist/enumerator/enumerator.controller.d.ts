import { PrismaService } from 'src/prisma/prisma.service';
import { EnumeratorService } from './enumerator.service';
export declare class EnumeratorController {
    private readonly prisma;
    private readonly enumeratorService;
    constructor(prisma: PrismaService, enumeratorService: EnumeratorService);
}
