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
exports.ConversionVehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversion_vehicle_entity_1 = require("../entities/conversion-vehicle.entity");
const conversion_client_entity_1 = require("../entities/conversion-client.entity");
let ConversionVehiclesService = class ConversionVehiclesService {
    conversionVehicleRepository;
    conversionClientRepository;
    constructor(conversionVehicleRepository, conversionClientRepository) {
        this.conversionVehicleRepository = conversionVehicleRepository;
        this.conversionClientRepository = conversionClientRepository;
    }
    async findAll() {
        return this.conversionVehicleRepository.find({
            relations: ['conversionClient'],
            order: { created_at: 'DESC' },
        });
    }
    async findByConversionClient(conversionClientId) {
        return this.conversionVehicleRepository.find({
            where: { conversion_client_id: conversionClientId },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const vehicle = await this.conversionVehicleRepository.findOne({
            where: { id },
            relations: ['conversionClient'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Conversion vehicle with ID ${id} not found`);
        }
        return vehicle;
    }
    async create(createConversionVehicleDto) {
        const conversionClient = await this.conversionClientRepository.findOne({
            where: { id: createConversionVehicleDto.conversion_client_id },
        });
        if (!conversionClient) {
            throw new common_1.NotFoundException(`Conversion client with ID ${createConversionVehicleDto.conversion_client_id} not found`);
        }
        const existingVehicle = await this.conversionVehicleRepository.findOne({
            where: {
                conversion_client_id: createConversionVehicleDto.conversion_client_id,
                registration_number: createConversionVehicleDto.registration_number,
            },
        });
        if (existingVehicle) {
            throw new Error(`Registration number ${createConversionVehicleDto.registration_number} already exists for this client`);
        }
        const vehicle = this.conversionVehicleRepository.create({
            conversion_client_id: createConversionVehicleDto.conversion_client_id,
            registration_number: createConversionVehicleDto.registration_number,
            vin_serial_number: createConversionVehicleDto.vin_serial_number,
            vehicle_type: createConversionVehicleDto.vehicle_type,
            year: createConversionVehicleDto.year,
            make: createConversionVehicleDto.make,
            model: createConversionVehicleDto.model,
            trim_option: createConversionVehicleDto.trim_option,
            transmission_type: createConversionVehicleDto.transmission_type,
            driven_wheel: createConversionVehicleDto.driven_wheel,
            engine: createConversionVehicleDto.engine,
            current_odo: createConversionVehicleDto.current_odo,
            odo_unit: createConversionVehicleDto.odo_unit || 'KM',
            color: createConversionVehicleDto.color,
            unit_number: createConversionVehicleDto.unit_number,
            notes: createConversionVehicleDto.notes,
            photo_url: createConversionVehicleDto.photo_url,
        });
        return this.conversionVehicleRepository.save(vehicle);
    }
    async update(id, updateConversionVehicleDto) {
        const vehicle = await this.findOne(id);
        if (updateConversionVehicleDto.registration_number &&
            updateConversionVehicleDto.registration_number !== vehicle.registration_number) {
            const existingVehicle = await this.conversionVehicleRepository.findOne({
                where: {
                    conversion_client_id: vehicle.conversion_client_id,
                    registration_number: updateConversionVehicleDto.registration_number,
                },
            });
            if (existingVehicle) {
                throw new Error(`Registration number ${updateConversionVehicleDto.registration_number} already exists for this client`);
            }
        }
        Object.assign(vehicle, updateConversionVehicleDto);
        return this.conversionVehicleRepository.save(vehicle);
    }
    async remove(id) {
        const vehicle = await this.findOne(id);
        await this.conversionVehicleRepository.remove(vehicle);
    }
};
exports.ConversionVehiclesService = ConversionVehiclesService;
exports.ConversionVehiclesService = ConversionVehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversion_vehicle_entity_1.ConversionVehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(conversion_client_entity_1.ConversionClient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ConversionVehiclesService);
//# sourceMappingURL=conversion-vehicles.service.js.map