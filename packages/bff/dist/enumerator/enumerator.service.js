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
exports.EnumeratorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EnumeratorService = class EnumeratorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        return this.prisma.user.create({
            data,
        });
    }
    async createUsersForVillages(data, count, code) {
        const users = [];
        console.log({ count, code });
        for (let i = 1; i <= count; i++) {
            users.push({
                userId: `${code}_${i}`,
                password: `${code}_${i}`,
                meta: {
                    gpCode: code,
                    village: data?.[i]?.spdpVillageId,
                    name: 'hello',
                },
            });
        }
        return users;
    }
    async getUsersFromGpCode(distinctGpCodes) {
        let users = [];
        for (let i = 0; i < distinctGpCodes.length; i++) {
            const rec = distinctGpCodes[i];
            const code = rec.gpCode;
            const villageUnderGp = await this.prisma.villageData.findMany({
                where: {
                    gpCode: code,
                },
            });
            const usersForGp = await this.createUsersForVillages(villageUnderGp, rec._count.gpCode, code);
            users = [...users, ...usersForGp];
        }
        return users;
    }
    async createEnumerators() {
        try {
            const distinctGpCodes = await this.prisma.villageData.groupBy({
                by: ['gpCode'],
                _count: {
                    gpCode: true,
                },
            });
            const users = await this.getUsersFromGpCode(distinctGpCodes);
            const enumerators = await this.prisma.user.createMany({
                data: users,
            });
            return enumerators;
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};
exports.EnumeratorService = EnumeratorService;
exports.EnumeratorService = EnumeratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnumeratorService);
//# sourceMappingURL=enumerator.service.js.map