// submission.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Submission } from '@prisma/client';

@Controller('submissions')
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post()
  async createSubmission(@Body() data: any): Promise<any> {
    return this.submissionService.createSubmission(data);
  }

  @Get()
  async getAllSubmissions(): Promise<any> {
    return this.submissionService.getAllSubmissions();
  }

  @Get(':id')
  async getSubmissionByVillageId(@Param('id') id: number): Promise<any> {
    return this.submissionService.getSubmissionByVillageId(id);
  }

  @Get('/citizen/:id')
  async getSubmissionByCitizenId(@Param('id') id: string): Promise<any> {
    return this.submissionService.getSubmissionByCitizenId(id);
  }

  @Put(':id')
  async updateSubmission(
    @Param('id') id: number,
    @Body() data: any,
  ): Promise<Submission | null> {
    return this.submissionService.updateSubmission(id, data);
  }

  @Delete(':id')
  async deleteSubmission(@Param('id') id: number): Promise<any> {
    return this.submissionService.deleteSubmission(id);
  }
}
