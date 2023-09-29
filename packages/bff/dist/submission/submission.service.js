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
const prisma_service_1 = require("../prisma/prisma.service");
let SubmissionService = class SubmissionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSubmission(data) {
        const submission = await this.prisma.submissionTest.create({
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
    async searchSubmissions(aadhar) {
        const submissions = await this.prisma.submission.findMany({
            where: {
                submissionData: {
                    path: ['name'],
                    string_contains: aadhar,
                },
            },
        });
        return submissions;
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
        const _id = Number(id);
        const skip = (page - 1) * pageSize;
        const submissions = await this.prisma.submission.findMany({
            where: { spdpVillageId: _id },
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        });
        const totalSubmissions = await this.prisma.submission.findMany({
            where: { spdpVillageId: _id },
        });
        return {
            result: {
                submissions,
                totalCount: totalSubmissions?.length,
                currentPage: page,
                totalPages: Math.ceil(totalSubmissions?.length / pageSize),
            },
        };
    }
    async getSubmissionByCitizenId(id) {
        return this.prisma.submission.findMany({
            where: { citizenId: id },
        });
    }
    async updateSubmission(id, data) {
        const updateSubmission = await this.prisma.submission.update({
            where: { id },
            data,
        });
        return { result: { updateSubmission } };
    }
    async deleteSubmission(id) {
        return this.prisma.submission.delete({
            where: { id },
        });
    }
};
exports.SubmissionService = SubmissionService;
exports.SubmissionService = SubmissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmissionService);
//# sourceMappingURL=submission.service.js.map