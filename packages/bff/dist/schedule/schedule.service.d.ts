import { PrismaService } from 'src/prisma/prisma.service';
import { Schedule } from '@prisma/client';
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    createSchedule(data: any): Promise<Schedule>;
    getAllSchedules(): Promise<Schedule[]>;
    getScheduleByEnumerator(id: string): Promise<any[]>;
}
