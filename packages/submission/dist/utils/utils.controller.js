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
const lodash_1 = require("lodash");
const fs = require("fs");
const filePath = './data.csv';
let UtilsController = class UtilsController {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getVillageData(limit) {
        return this.prismaService.villageData.findMany({
            take: 1000,
        });
    }
    async uploadCSV() {
        fs.readFile(filePath, 'utf8', async (err, data) => {
            (0, lodash_1.dropRight)((0, lodash_1.map)(data.split('\n'), async (e) => {
                if (true) {
                    const colArray = e.split(',');
                    if (colArray[1]?.replaceAll('"', '') !== '' &&
                        colArray[1]?.replaceAll('"', '')) {
                        const obj = {
                            districtName: colArray[1]?.replaceAll('"', ''),
                            tehsilName: colArray[2]?.replaceAll('"', ''),
                            riCircleName: colArray[3]?.replaceAll('"', ''),
                            villageName: colArray[4]?.replaceAll('"', ''),
                            distLGDCode: colArray[5]?.replaceAll('"', ''),
                            blockLGDCode: colArray[6]?.replaceAll('"', ''),
                            gplgdCode: colArray[7]?.replaceAll('"', ''),
                            villageLGDCode: colArray[8]?.replaceAll('"', ''),
                            spdpVillageId: colArray[9]?.replaceAll('"', ''),
                        };
                        const rr = await this.prismaService.villageData.create({
                            data: obj,
                        });
                        console.log({ rr });
                        return obj;
                    }
                    else
                        return;
                }
            }), 3);
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
    (0, common_1.Post)('csv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "uploadCSV", null);
exports.UtilsController = UtilsController = __decorate([
    (0, common_1.Controller)('utils'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map