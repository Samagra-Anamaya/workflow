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
const utils_service_1 = require("./utils.service");
const util_dto_1 = require("./dto/util.dto");
let UtilsController = class UtilsController {
    constructor(utilService) {
        this.utilService = utilService;
    }
    async getVillageData(page, limit) {
        const validatedLimit = Number(limit) || 10;
        const validatedPage = Number(page) || 1;
        return this.utilService.getVillages(validatedPage, validatedLimit);
    }
    async getVillageById(id) {
        return this.utilService.getVillageById(id);
    }
    async addVillage(data) {
        return this.utilService.addVillage(data);
    }
};
exports.UtilsController = UtilsController;
__decorate([
    (0, common_1.Get)('villageData'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "getVillageData", null);
__decorate([
    (0, common_1.Get)('/villageData/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "getVillageById", null);
__decorate([
    (0, common_1.Post)('/addVillage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [util_dto_1.CreateVillageDto]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "addVillage", null);
exports.UtilsController = UtilsController = __decorate([
    (0, common_1.Controller)('utils'),
    __metadata("design:paramtypes", [utils_service_1.UtilsService])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map