import { PrismaService } from 'src/prisma/prisma.service';
import { EnumeratorService } from './enumerator.service';
export declare class EnumeratorController {
    private readonly prisma;
    private readonly enumeratorService;
    constructor(prisma: PrismaService, enumeratorService: EnumeratorService);
    findAll(): Promise<any>;
    create(user: any): Promise<any>;
    createEnumerators(user: any): Promise<any>;
    createAdmin(user: any): Promise<any>;
    findAllAdmin(): Promise<any>;
}
