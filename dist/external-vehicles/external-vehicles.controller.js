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
exports.ExternalVehiclesController = void 0;
const common_1 = require("@nestjs/common");
const external_vehicles_service_1 = require("./external-vehicles.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const external_vehicle_dto_1 = require("./dto/external-vehicle.dto");
let ExternalVehiclesController = class ExternalVehiclesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findOwners(type) {
        return this.service.findAllOwners(type);
    }
    createOwner(dto) {
        return this.service.createOwner(dto);
    }
    updateOwner(id, dto) {
        return this.service.updateOwner(id, dto);
    }
    async removeOwner(id) {
        await this.service.removeOwner(id);
        return { message: 'Owner deleted successfully' };
    }
    findAll() {
        return this.service.findAllVehicles();
    }
    findOne(id) {
        return this.service.findVehicle(id);
    }
    create(dto) {
        return this.service.createVehicle(dto);
    }
    update(id, dto) {
        return this.service.updateVehicle(id, dto);
    }
    async remove(id) {
        await this.service.removeVehicle(id);
        return { message: 'External vehicle deleted successfully' };
    }
};
exports.ExternalVehiclesController = ExternalVehiclesController;
__decorate([
    (0, common_1.Get)('owners'),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "findOwners", null);
__decorate([
    (0, common_1.Post)('owners'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [external_vehicle_dto_1.CreateExternalVehicleOwnerDto]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "createOwner", null);
__decorate([
    (0, common_1.Put)('owners/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, external_vehicle_dto_1.UpdateExternalVehicleOwnerDto]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "updateOwner", null);
__decorate([
    (0, common_1.Delete)('owners/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExternalVehiclesController.prototype, "removeOwner", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [external_vehicle_dto_1.CreateExternalVehicleDto]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, external_vehicle_dto_1.UpdateExternalVehicleDto]),
    __metadata("design:returntype", void 0)
], ExternalVehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ExternalVehiclesController.prototype, "remove", null);
exports.ExternalVehiclesController = ExternalVehiclesController = __decorate([
    (0, common_1.Controller)('external-vehicles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [external_vehicles_service_1.ExternalVehiclesService])
], ExternalVehiclesController);
//# sourceMappingURL=external-vehicles.controller.js.map