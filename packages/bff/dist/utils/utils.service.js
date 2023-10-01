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
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UtilsService = class UtilsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVillageById(id) {
        const villages = await this.prisma.villageData.findFirst({
            where: {
                spdpVillageId: Number(id),
            },
        });
        return {
            result: villages,
        };
    }
    async addVillage(data) {
        const newVillage = await this.prisma.villageData.create({
            data,
        });
        return {
            result: newVillage,
        };
    }
    async getVillages(page, pageSize) {
        const skip = (page - 1) * pageSize;
        const villages = await this.prisma.villageData.findMany({
            skip,
            take: pageSize,
            orderBy: { spdpVillageId: 'asc' },
        });
        const totalCount = await this.prisma.villageData.count();
        return {
            result: {
                villages,
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    }
};
exports.UtilsService = UtilsService;
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilsService);
//# sourceMappingURL=utils.service.js.map