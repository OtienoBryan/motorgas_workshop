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
exports.UpdateExternalVehicleOwnerDto = exports.CreateExternalVehicleOwnerDto = exports.UpdateExternalVehicleDto = exports.CreateExternalVehicleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const external_vehicle_entity_1 = require("../../entities/external-vehicle.entity");
class CreateExternalVehicleDto {
    registration_number;
    make;
    model;
    fuel_type;
    location;
    owner_id;
}
exports.CreateExternalVehicleDto = CreateExternalVehicleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateExternalVehicleDto.prototype, "registration_number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExternalVehicleDto.prototype, "make", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExternalVehicleDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsIn)(external_vehicle_entity_1.EXTERNAL_VEHICLE_FUEL_TYPES),
    __metadata("design:type", String)
], CreateExternalVehicleDto.prototype, "fuel_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExternalVehicleDto.prototype, "location", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateExternalVehicleDto.prototype, "owner_id", void 0);
class UpdateExternalVehicleDto extends (0, mapped_types_1.PartialType)(CreateExternalVehicleDto) {
}
exports.UpdateExternalVehicleDto = UpdateExternalVehicleDto;
class CreateExternalVehicleOwnerDto {
    ownership_type;
    name;
    id_number;
    contact_person;
    phone;
    email;
    address;
}
exports.CreateExternalVehicleOwnerDto = CreateExternalVehicleOwnerDto;
__decorate([
    (0, class_validator_1.IsIn)(['individual', 'company', 'sacco']),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "ownership_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "id_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "contact_person", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExternalVehicleOwnerDto.prototype, "address", void 0);
class UpdateExternalVehicleOwnerDto extends (0, mapped_types_1.PartialType)(CreateExternalVehicleOwnerDto) {
}
exports.UpdateExternalVehicleOwnerDto = UpdateExternalVehicleOwnerDto;
//# sourceMappingURL=external-vehicle.dto.js.map