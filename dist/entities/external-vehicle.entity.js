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
exports.ExternalVehicle = exports.EXTERNAL_VEHICLE_FUEL_TYPES = void 0;
const typeorm_1 = require("typeorm");
const external_vehicle_owner_entity_1 = require("./external-vehicle-owner.entity");
exports.EXTERNAL_VEHICLE_FUEL_TYPES = ['Petrol', 'Diesel', 'LPG', 'Petrol/LPG', 'Hybrid', 'Electric'];
let ExternalVehicle = class ExternalVehicle {
    id;
    registration_number;
    make;
    model;
    fuel_type;
    location;
    owner_id;
    owner;
    created_at;
    updated_at;
};
exports.ExternalVehicle = ExternalVehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExternalVehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ExternalVehicle.prototype, "registration_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ExternalVehicle.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ExternalVehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: exports.EXTERNAL_VEHICLE_FUEL_TYPES }),
    __metadata("design:type", String)
], ExternalVehicle.prototype, "fuel_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ExternalVehicle.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id', type: 'int' }),
    __metadata("design:type", Number)
], ExternalVehicle.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => external_vehicle_owner_entity_1.ExternalVehicleOwner),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", external_vehicle_owner_entity_1.ExternalVehicleOwner)
], ExternalVehicle.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExternalVehicle.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ExternalVehicle.prototype, "updated_at", void 0);
exports.ExternalVehicle = ExternalVehicle = __decorate([
    (0, typeorm_1.Entity)('external_vehicles')
], ExternalVehicle);
//# sourceMappingURL=external-vehicle.entity.js.map