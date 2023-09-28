import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class EnumeratorService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    createUsersForVillages(data: any, count: number, code: number): Promise<any>;
    getUsersFromGpCode(distinctGpCodes: any): Promise<any>;
    createEnumerators(): Promise<any>;
}
