// submission.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseFilters,
  BadRequestException,
  InternalServerErrorException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Submission } from '@prisma/client';
import {
  BulkSubmissionDto,
  CreateSubmissionDto,
  GetAllSubmissionsDto,
  UpdateSubmissionDto,
} from './dto/submission.dto';
import { PrismaExceptionFilter } from 'src/exceptions/exception-filter';
import { CustomLogger } from 'src/common/logger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth-gaurd';

@Controller('submissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseFilters(PrismaExceptionFilter)
export class SubmissionController {
  private logger: CustomLogger;
  constructor(private submissionService: SubmissionService) {
    this.logger = new CustomLogger('SubmissionController');
  }

  @Post()
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<any> {
    return this.submissionService.createSubmission(createSubmissionDto);
  }

  @Post('/bulk')
  async createBulkSubmission(
    @Body() bulkData: BulkSubmissionDto,
  ): Promise<any> {
    return this.submissionService.bulkSubmission(bulkData);
  }

  @Get()
  async getAllSubmissions(@Query() query: GetAllSubmissionsDto): Promise<any> {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      return this.submissionService.getSubmissions(page, limit);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Get(':id')
  async getSubmissionByVillageId(
    @Param('id') id: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<any> {
    const validatedId = Number(id);
    const validatedPage = Number(page) || 1;
    const validatedLimit = Number(limit) || 10;

    if (isNaN(validatedId) || isNaN(validatedPage) || isNaN(validatedLimit)) {
      throw new BadRequestException('Invalid input parameters');
    }

    return await this.submissionService.getSubmissionByVillageId(
      validatedId,
      validatedPage,
      validatedLimit,
    );
  }

  @Get('/search/:villageId/:text')
  async searchSubmission(
    @Param('villageId') villageId: string,
    @Param('text') name: string,
  ): Promise<any> {
    if (
      !name ||
      name.trim().length === 0 ||
      !villageId ||
      villageId.trim().length === 0
    ) {
      throw new BadRequestException('Invalid input: name cannot be empty');
    }

    try {
      return await this.submissionService.searchSubmissions(villageId, name);
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException('Failed to search submissions');
    }
  }

  @Get('/enumerator/:id')
  async getSubmissionByEnumeratorId(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Invalid input: ID cannot be empty');
    }
    const validatedPage = Number(page) || 1;
    const validatedLimit = Number(limit) || 10;

    if (isNaN(validatedPage) || isNaN(validatedLimit)) {
      throw new BadRequestException('Invalid input parameters');
    }

    try {
      return await this.submissionService.getSubmissionByEnumeratorId(
        id,
        validatedPage,
        validatedLimit,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Failed to retrieve submission by citizen ID',
      );
    }
  }

  @Get('/citizen/:id')
  async getSubmissionByCitizenId(@Param('id') id: string): Promise<any> {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Invalid input: ID cannot be empty');
    }

    try {
      return await this.submissionService.getSubmissionByCitizenId(id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Failed to retrieve submission by citizen ID',
      );
    }
  }

  @Put(':id')
  async updateSubmission(
    @Param('id') id: string,
    @Body() data: UpdateSubmissionDto, // Use the Submission interface/type instead of 'any'
  ): Promise<Submission | null> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return await this.submissionService.updateSubmission(id, data);
  }

  @Delete('deleteAll')
  async deleteSubmission(): Promise<any> {
    return this.submissionService.deleteAllSubmission();
  }
}
