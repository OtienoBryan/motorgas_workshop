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
exports.ExternalVehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const external_vehicle_entity_1 = require("../entities/external-vehicle.entity");
const external_vehicle_owner_entity_1 = require("../entities/external-vehicle-owner.entity");
let ExternalVehiclesService = class ExternalVehiclesService {
    vehicleRepository;
    ownerRepository;
    constructor(vehicleRepository, ownerRepository) {
        this.vehicleRepository = vehicleRepository;
        this.ownerRepository = ownerRepository;
    }
    findAllVehicles() {
        return this.vehicleRepository.find({ relations: ['owner'], order: { created_at: 'DESC' } });
    }
    async findVehicle(id) {
        const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['owner'] });
        if (!vehicle)
            throw new common_1.NotFoundException(`External vehicle with ID ${id} not found`);
        return vehicle;
    }
    normalizeReg(reg) {
        return reg.trim().toUpperCase();
    }
    async assertOwnerExists(ownerId) {
        const owner = await this.ownerRepository.findOne({ where: { id: ownerId } });
        if (!owner)
            throw new common_1.BadRequestException(`Owner with ID ${ownerId} not found`);
    }
    async assertRegistrationFree(reg, exceptId) {
        const existing = await this.vehicleRepository.findOne({ where: { registration_number: reg } });
        if (existing && existing.id !== exceptId) {
            throw new common_1.ConflictException(`Registration number ${reg} already exists`);
        }
    }
    async createVehicle(dto) {
        const registration_number = this.normalizeReg(dto.registration_number);
        await this.assertOwnerExists(dto.owner_id);
        await this.assertRegistrationFree(registration_number);
        const saved = await this.vehicleRepository.save(this.vehicleRepository.create({ ...dto, registration_number }));
        return this.findVehicle(saved.id);
    }
    async updateVehicle(id, dto) {
        const vehicle = await this.findVehicle(id);
        const data = { ...dto };
        if (data.registration_number !== undefined) {
            data.registration_number = this.normalizeReg(data.registration_number);
            await this.assertRegistrationFree(data.registration_number, id);
        }
        if (data.owner_id !== undefined)
            await this.assertOwnerExists(data.owner_id);
        delete vehicle.owner;
        Object.assign(vehicle, data);
        await this.vehicleRepository.save(vehicle);
        return this.findVehicle(id);
    }
    async removeVehicle(id) {
        const vehicle = await this.findVehicle(id);
        await this.vehicleRepository.remove(vehicle);
    }
    async findAllOwners(type) {
        const isValidType = type === 'individual' || type === 'company' || type === 'sacco';
        const [owners, counts] = await Promise.all([
            this.ownerRepository.find({
                where: isValidType ? { ownership_type: type } : undefined,
                order: { name: 'ASC' },
            }),
            this.vehicleRepository
                .createQueryBuilder('v')
                .select('v.owner_id', 'owner_id')
                .addSelect('COUNT(*)', 'count')
                .groupBy('v.owner_id')
                .getRawMany(),
        ]);
        const countByOwner = new Map(counts.map((c) => [Number(c.owner_id), Number(c.count)]));
        return owners.map((o) => Object.assign(o, { vehicle_count: countByOwner.get(o.id) ?? 0 }));
    }
    async findOwner(id) {
        const owner = await this.ownerRepository.findOne({ where: { id } });
        if (!owner)
            throw new common_1.NotFoundException(`Owner with ID ${id} not found`);
        return owner;
    }
    createOwner(dto) {
        return this.ownerRepository.save(this.ownerRepository.create(dto));
    }
    async updateOwner(id, dto) {
        const owner = await this.findOwner(id);
        Object.assign(owner, dto);
        return this.ownerRepository.save(owner);
    }
    async removeOwner(id) {
        const owner = await this.findOwner(id);
        const inUse = await this.vehicleRepository.count({ where: { owner_id: id } });
        if (inUse > 0) {
            throw new common_1.ConflictException(`Owner is linked to ${inUse} vehicle(s) and cannot be deleted`);
        }
        await this.ownerRepository.remove(owner);
    }
};
exports.ExternalVehiclesService = ExternalVehiclesService;
exports.ExternalVehiclesService = ExternalVehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(external_vehicle_entity_1.ExternalVehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(external_vehicle_owner_entity_1.ExternalVehicleOwner)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExternalVehiclesService);
//# sourceMappingURL=external-vehicles.service.js.map