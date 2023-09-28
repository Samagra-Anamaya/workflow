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
const auth_guard_1 = require("../auth/auth.guard");
const utils_service_1 = require("./utils.service");
let UtilsController = class UtilsController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }
    getSecureData() {
        return `Hello! This is secure data.`;
    }
    async getVillageData(page, limit) {
        return this.submissionService.getVillages(Number(page) || 1, Number(limit) || 10);
    }
    async getVillageById(id) {
        return this.submissionService.getVillageById(id);
    }
    async addVillage(data) {
        return this.submissionService.addVillage(data);
    }
};
exports.UtilsController = UtilsController;
__decorate([
    (0, common_1.Get)('secure'),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UtilsController.prototype, "getSecureData", null);
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
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "addVillage", null);
exports.UtilsController = UtilsController = __decorate([
    (0, common_1.Controller)('utils'),
    __metadata("design:paramtypes", [utils_service_1.UtilsService])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map