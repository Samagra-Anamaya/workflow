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
exports.EnumeratorController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const enumerator_service_1 = require("./enumerator.service");
let EnumeratorController = class EnumeratorController {
    constructor(prisma, enumeratorService) {
        this.prisma = prisma;
        this.enumeratorService = enumeratorService;
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users;
    }
    async create(user) {
        const newUser = await this.prisma.user.create({
            data: user,
        });
        return newUser;
    }
    async createEnumerators(user) {
        return this.enumeratorService.createEnumerators();
    }
    async createAdmin(user) {
        const newUser = await this.prisma.admin.create({
            data: user,
        });
        return newUser;
    }
    async findAllAdmin() {
        const users = await this.prisma.admin.findMany();
        return users;
    }
};
exports.EnumeratorController = EnumeratorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnumeratorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnumeratorController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('createEnumerators'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnumeratorController.prototype, "createEnumerators", null);
__decorate([
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnumeratorController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnumeratorController.prototype, "findAllAdmin", null);
exports.EnumeratorController = EnumeratorController = __decorate([
    (0, common_1.Controller)('enumerator'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        enumerator_service_1.EnumeratorService])
], EnumeratorController);
//# sourceMappingURL=enumerator.controller.js.map