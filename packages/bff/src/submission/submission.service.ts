// submission.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomLogger } from 'src/common/logger';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionService {
  private logger: CustomLogger;
  constructor(private prisma: PrismaService) {
    this.logger = new CustomLogger('SubmissionService');
  }

  async createSubmission(data: any): Promise<any> {
    try {
      const village = await this.prisma.villageData.findFirst({
        where: { spdpVillageId: data.spdpVillageId },
      });

      if (!village) {
        throw new NotFoundException(
          `Village with spdpVillageId ${data.spdpVillageId} not found`,
        );
      }
      const submission = await this.prisma.submission.create({
        data,
      });

      const villageData = await this.prisma.villageData.update({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          spdpVillageId: data.spdpVillageId,
        },
        data: {
          surveySubmitted: { increment: 1 },
        },
      });

      return { result: { submission, villageData } };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchSubmissions(text: string) {
    try {
      const submissions = await this.prisma.submission.findMany({
        where: {
          OR: [
            {
              submissionData: {
                path: ['aadharNumber'],
                string_contains: text,
              },
            },
            {
              submissionData: {
                path: ['beneficiaryName'],
                string_contains: text,
              },
            },
          ],
        },
      });

      return submissions;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSubmissions(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const submissions = await this.prisma.submission.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }, // Change to 'asc' for ascending order
    });

    const totalCount = await this.prisma.submission.count();

    return {
      result: {
        submissions,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async getSubmissionByVillageId(
    id: number,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const village = await this.prisma.villageData.findFirst({
      where: { spdpVillageId: id },
    });

    if (!village) {
      throw new NotFoundException(`Village with spdpVillageId ${id} not found`);
    }
    const skip = (page - 1) * pageSize;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: { spdpVillageId: id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({
        where: { spdpVillageId: id },
      }),
    ]);

    return {
      result: {
        submissions,
        totalCount: total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getSubmissionByCitizenId(id: string): Promise<any> {
    return this.prisma.submission.findMany({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: { citizenId: id },
    });
  }

  async updateSubmission(id: string, newdata: any): Promise<any> {
    try {
      const submission = await this.prisma.submission.findFirst({
        where: {
          id,
        },
      });

      if (!submission) {
        throw new NotFoundException(`Submission with id: ${id} not found`);
      }
      const updateSubmission = await this.prisma.submission.update({
        where: { id },
        data: {
          submissionData: newdata,
        },
      });

      return { result: { updateSubmission } };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async deleteSubmission(id: number): Promise<any> {
  //   return this.prisma.submission.delete({
  //     where: { id },
  //   });
  // }
}
