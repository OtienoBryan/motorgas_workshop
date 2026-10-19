"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalVehiclesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const external_vehicles_service_1 = require("./external-vehicles.service");
const external_vehicles_controller_1 = require("./external-vehicles.controller");
const external_vehicle_entity_1 = require("../entities/external-vehicle.entity");
const external_vehicle_owner_entity_1 = require("../entities/external-vehicle-owner.entity");
let ExternalVehiclesModule = class ExternalVehiclesModule {
};
exports.ExternalVehiclesModule = ExternalVehiclesModule;
exports.ExternalVehiclesModule = ExternalVehiclesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([external_vehicle_entity_1.ExternalVehicle, external_vehicle_owner_entity_1.ExternalVehicleOwner])],
        controllers: [external_vehicles_controller_1.ExternalVehiclesController],
        providers: [external_vehicles_service_1.ExternalVehiclesService],
    })
], ExternalVehiclesModule);
//# sourceMappingURL=external-vehicles.module.js.map