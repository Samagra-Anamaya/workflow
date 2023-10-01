"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const common_1 = require("@nestjs/common");
const logger_1 = require("../common/logger");
const prisma_service_1 = require("../prisma/prisma.service");
let SubmissionService = class SubmissionService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new logger_1.CustomLogger('SubmissionService');
    }
    async createSubmission(data) {
        try {
            const village = await this.prisma.villageData.findFirst({
                where: { spdpVillageId: data.spdpVillageId },
            });
            if (!village) {
                throw new common_1.NotFoundException(`Village with spdpVillageId ${data.spdpVillageId} not found`);
            }
            const submission = await this.prisma.submission.create({
                data,
            });
            const villageData = await this.prisma.villageData.update({
                where: {
                    spdpVillageId: data.spdpVillageId,
                },
                data: {
                    surveySubmitted: { increment: 1 },
                },
            });
            return { result: { submission, villageData } };
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchSubmissions(text) {
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
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSubmissions(page, pageSize) {
        const skip = (page - 1) * pageSize;
        const submissions = await this.prisma.submission.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
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
    async getSubmissionByVillageId(id, page, pageSize) {
        const village = await this.prisma.villageData.findFirst({
            where: { spdpVillageId: id },
        });
        if (!village) {
            throw new common_1.NotFoundException(`Village with spdpVillageId ${id} not found`);
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
    async getSubmissionByCitizenId(id) {
        return this.prisma.submission.findMany({
            where: { citizenId: id },
        });
    }
    async updateSubmission(id, newdata) {
        try {
            const submission = await this.prisma.submission.findFirst({
                where: {
                    id,
                },
            });
            if (!submission) {
                throw new common_1.NotFoundException(`Submission with id: ${id} not found`);
            }
            const updateSubmission = await this.prisma.submission.update({
                where: { id },
                data: {
                    submissionData: newdata,
                },
            });
            return { result: { updateSubmission } };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SubmissionService = SubmissionService;
exports.SubmissionService = SubmissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionService);
//# sourceMappingURL=submission.service.js.map