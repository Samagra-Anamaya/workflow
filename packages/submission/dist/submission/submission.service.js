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
        const _data = {
            ...data,
        };
        const submission = await this.prisma.submission.create({
            data: _data,
        });
        return submission;
    }
    async getAllSubmissions() {
        return this.prisma.submission.findMany({
            include: {
                submitter: {},
            },
        });
    }
    async getSubmissionById(id) {
        const _id = Number(id);
        return this.prisma.submission.findUnique({
            where: { id: _id },
            include: {
                submitter: {},
            },
        });
    }
    async updateSubmission(id, data) {
        return this.prisma.submission.update({
            where: { id },
            data,
        });
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