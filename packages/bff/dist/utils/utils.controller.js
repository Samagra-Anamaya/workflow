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
exports.UtilsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const village_data_1 = require("./village-data");
let UtilsController = class UtilsController {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getVillageData(limit) {
        return this.prismaService.villageData.findMany({
            take: 1000,
        });
    }
    async getSubmissionByCitizenId(id) {
        return this.prismaService.villageData.findFirst({
            where: {
                spdpVillageId: Number(id),
            },
        });
    }
    async uploadVillageData() {
        return await this.prismaService.villageData.createMany({
            data: village_data_1.villageRecords,
        });
    }
};
exports.UtilsController = UtilsController;
__decorate([
    (0, common_1.Get)('villageData'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "getVillageData", null);
__decorate([
    (0, common_1.Get)('/villageData/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "getSubmissionByCitizenId", null);
__decorate([
    (0, common_1.Post)('csv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "uploadVillageData", null);
exports.UtilsController = UtilsController = __decorate([
    (0, common_1.Controller)('utils'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map