// submission.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomLogger } from 'src/common/logger';
import { PrismaService } from 'src/prisma/prisma.service';
import { map } from 'lodash';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SubmissionService {
  private logger: CustomLogger;

  constructor(private prisma: PrismaService) {
    this.logger = new CustomLogger('SubmissionService');
  }

  async searchByAadhaar(aadhaar: string, villageId: string): Promise<any> {
    const submissions = await this.prisma.submission.findMany({
      where: {
        spdpVillageId: Number(villageId),
      },
      orderBy: { createdAt: 'desc' },
    });

    const matchingSubmissions = [];
    for (const submission of submissions) {
      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        submission.submissionData.aadharNumber &&
        (await bcrypt.compare(
          aadhaar,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          submission.submissionData.aadharNumber,
        ))
      ) {
        matchingSubmissions.push(submission);
        break;
      }
    }

    return matchingSubmissions;
  }

  async bulkSubmission(data: any): Promise<any> {
    try {
      const result = {};

      for (const villageId of Object.keys(data)) {
        const village = await this.prisma.villageData.findFirst({
          where: { spdpVillageId: Number(villageId) },
        });

        if (!village) {
          throw new NotFoundException(
            `Village with spdpVillageId ${villageId} not found`,
          );
        }
        const submissionsData = await Promise.all(
          map(data?.[villageId], async (record) => {
            const saltRounds = 3; // Number of salt rounds for bcrypt
            const hashedAadhar = await bcrypt.hash(
              record?.submissionData?.aadharNumber,
              saltRounds,
            );
            record.submissionData.aadharNumber = hashedAadhar;
            return record;
          }),
        );

        const submissions = await this.prisma.submission.createMany({
          data: submissionsData,
        });

        const newVillageData = await this.prisma.villageData.update({
          where: {
            spdpVillageId: Number(villageId),
          },
          data: {
            surveySubmitted: { increment: Number(submissionsData?.length) },
          },
        });
        result[villageId] = {
          submissions: submissions,
          villageData: newVillageData,
        };
      }

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
      const saltRounds = 3; // Number of salt rounds for bcrypt
      const hashedAadhar = await bcrypt.hash(
        data?.submissionData?.aadharNumber,
        saltRounds,
      );
      data.submissionData.aadharNumber = hashedAadhar;
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

  async searchSubmissions(villageId: string, text: string) {
    try {
      let submissions;
      if (!Number.isNaN(Number(text))) {
        submissions = await this.searchByAadhaar(text, villageId);
      } else {
        submissions = await this.prisma.$queryRawUnsafe(
          `SELECT * FROM "public"."Submission"
        WHERE 
          "spdpVillageId" = ${villageId} AND 
          "submissionData"->>'beneficiaryName' ILIKE '%${text}%' LIMIT 10`,
        );
      }

      return { result: { submissions } };
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

  async getSubmissionByEnumeratorId(
    id: string,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const skip = (page - 1) * pageSize;

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where: { submitterId: id },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({
        where: { submitterId: id },
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
