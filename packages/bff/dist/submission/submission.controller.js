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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const common_1 = require("@nestjs/common");
const submission_service_1 = require("./submission.service");
const submission_dto_1 = require("./dto/submission.dto");
const exception_filter_1 = require("../exceptions/exception-filter");
const logger_1 = require("../common/logger");
let SubmissionController = class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
        this.logger = new logger_1.CustomLogger('SubmissionController');
    }
    async createSubmission(createSubmissionDto) {
        return this.submissionService.createSubmission(createSubmissionDto);
    }
    async getAllSubmissions(query) {
        try {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            return this.submissionService.getSubmissions(page, limit);
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    async getSubmissionByVillageId(id, page, limit) {
        const validatedId = Number(id);
        const validatedPage = Number(page) || 1;
        const validatedLimit = Number(limit) || 10;
        if (isNaN(validatedId) || isNaN(validatedPage) || isNaN(validatedLimit)) {
            throw new common_1.BadRequestException('Invalid input parameters');
        }
        return await this.submissionService.getSubmissionByVillageId(validatedId, validatedPage, validatedLimit);
    }
    async searchSubmission(name) {
        if (!name || name.trim().length === 0) {
            throw new common_1.BadRequestException('Invalid input: name cannot be empty');
        }
        try {
            return await this.submissionService.searchSubmissions(name);
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Failed to search submissions');
        }
    }
    async getSubmissionByCitizenId(id) {
        if (!id || id.trim().length === 0) {
            throw new common_1.BadRequestException('Invalid input: ID cannot be empty');
        }
        try {
            return await this.submissionService.getSubmissionByCitizenId(id);
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve submission by citizen ID');
        }
    }
    async updateSubmission(id, data) {
        return await this.submissionService.updateSubmission(id, data);
    }
};
exports.SubmissionController = SubmissionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submission_dto_1.CreateSubmissionDto]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "createSubmission", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submission_dto_1.GetAllSubmissionsDto]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getAllSubmissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getSubmissionByVillageId", null);
__decorate([
    (0, common_1.Get)('/search/:text'),
    __param(0, (0, common_1.Param)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "searchSubmission", null);
__decorate([
    (0, common_1.Get)('/citizen/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "getSubmissionByCitizenId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submission_dto_1.UpdateSubmissionDto]),
    __metadata("design:returntype", Promise)
], SubmissionController.prototype, "updateSubmission", null);
exports.SubmissionController = SubmissionController = __decorate([
    (0, common_1.Controller)('submissions'),
    (0, common_1.UseFilters)(exception_filter_1.PrismaExceptionFilter),
    __metadata("design:paramtypes", [submission_service_1.SubmissionService])
], SubmissionController);
//# sourceMappingURL=submission.controller.js.map