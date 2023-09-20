import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('submission')
export class SubmissionController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(): Promise<any> {
    const submissions = await this.prisma.submission.findMany();
    return submissions;
  }

  @Post()
  async createSubmission(
    @Body()
    createSubmissionDto: {
      submitter: any;
      submissionData: any;
      meta: any;
      submitterId: string;
    },
  ) {
    // Data validation (you can use class-validator for more advanced validation)
    // if (!createSubmissionDto.title || !createSubmissionDto.content) {
    //   throw new BadRequestException('Title and content are required.');
    // }

    // Create a new submission using Prisma
    const newSubmission = await this.prisma.submission.create({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      data: createSubmissionDto,
    });

    return newSubmission;
  }
}
