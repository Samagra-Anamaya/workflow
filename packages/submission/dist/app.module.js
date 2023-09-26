"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const submission_controller_1 = require("./submission/submission.controller");
const prisma_service_1 = require("./prisma/prisma.service");
const prisma_module_1 = require("./prisma/prisma.module");
const enumerator_module_1 = require("./enumerator/enumerator.module");
const submission_service_1 = require("./submission/submission.service");
const schedule_module_1 = require("./schedule/schedule.module");
const utils_module_1 = require("./utils/utils.module");
const schedule_service_1 = require("./schedule/schedule.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, enumerator_module_1.EnumeratorModule, schedule_module_1.ScheduleModule, utils_module_1.UtilsModule],
        controllers: [app_controller_1.AppController, submission_controller_1.SubmissionController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, submission_service_1.SubmissionService, schedule_service_1.ScheduleService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map