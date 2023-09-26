import { PrismaService } from 'src/prisma/prisma.service';
export declare class EnumeratorController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    create(user: any): Promise<any>;
    createAdmin(user: any): Promise<any>;
    findAllAdmin(): Promise<any>;
}
