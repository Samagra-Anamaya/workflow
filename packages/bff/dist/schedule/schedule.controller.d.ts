import { ScheduleService } from './schedule.service';
import { Schedule } from '@prisma/client';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
    createSubmission(data: any): Promise<any>;
    getAllSubmissions(): Promise<Schedule[]>;
    getScheduleByEnumeratorId(id: string): Promise<any>;
}
