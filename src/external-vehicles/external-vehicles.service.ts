import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalVehicle } from '../entities/external-vehicle.entity';
import { ExternalVehicleOwner } from '../entities/external-vehicle-owner.entity';
import {
  CreateExternalVehicleDto,
  UpdateExternalVehicleDto,
  CreateExternalVehicleOwnerDto,
  UpdateExternalVehicleOwnerDto,
} from './dto/external-vehicle.dto';

@Injectable()
export class ExternalVehiclesService {
  constructor(
    @InjectRepository(ExternalVehicle)
    private vehicleRepository: Repository<ExternalVehicle>,
    @InjectRepository(ExternalVehicleOwner)
    private ownerRepository: Repository<ExternalVehicleOwner>,
  ) {}

  // ---- Vehicles ----
  findAllVehicles(): Promise<ExternalVehicle[]> {
    return this.vehicleRepository.find({ relations: ['owner'], order: { created_at: 'DESC' } });
  }

  async findVehicle(id: number): Promise<ExternalVehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!vehicle) throw new NotFoundException(`External vehicle with ID ${id} not found`);
    return vehicle;
  }

  private normalizeReg(reg: string): string {
    return reg.trim().toUpperCase();
  }

  private async assertOwnerExists(ownerId: number): Promise<void> {
    const owner = await this.ownerRepository.findOne({ where: { id: ownerId } });
    if (!owner) throw new BadRequestException(`Owner with ID ${ownerId} not found`);
  }

  private async assertRegistrationFree(reg: string, exceptId?: number): Promise<void> {
    const existing = await this.vehicleRepository.findOne({ where: { registration_number: reg } });
    if (existing && existing.id !== exceptId) {
      throw new ConflictException(`Registration number ${reg} already exists`);
    }
  }

  async createVehicle(dto: CreateExternalVehicleDto): Promise<ExternalVehicle> {
    const registration_number = this.normalizeReg(dto.registration_number);
    await this.assertOwnerExists(dto.owner_id);
    await this.assertRegistrationFree(registration_number);
    const saved = await this.vehicleRepository.save(
      this.vehicleRepository.create({ ...dto, registration_number }),
    );
    return this.findVehicle(saved.id);
  }

  async updateVehicle(id: number, dto: UpdateExternalVehicleDto): Promise<ExternalVehicle> {
    const vehicle = await this.findVehicle(id);
    const data: UpdateExternalVehicleDto = { ...dto };
    if (data.registration_number !== undefined) {
      data.registration_number = this.normalizeReg(data.registration_number);
      await this.assertRegistrationFree(data.registration_number, id);
    }
    if (data.owner_id !== undefined) await this.assertOwnerExists(data.owner_id);
    // Drop the loaded relation so an owner_id change isn't overridden on save
    delete vehicle.owner;
    Object.assign(vehicle, data);
    await this.vehicleRepository.save(vehicle);
    return this.findVehicle(id);
  }

  async removeVehicle(id: number): Promise<void> {
    const vehicle = await this.findVehicle(id);
    await this.vehicleRepository.remove(vehicle);
  }

  // ---- Owners ----
  async findAllOwners(type?: string): Promise<(ExternalVehicleOwner & { vehicle_count: number })[]> {
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
        .getRawMany<{ owner_id: number; count: string }>(),
    ]);
    const countByOwner = new Map(counts.map((c) => [Number(c.owner_id), Number(c.count)]));
    return owners.map((o) => Object.assign(o, { vehicle_count: countByOwner.get(o.id) ?? 0 }));
  }

  async findOwner(id: number): Promise<ExternalVehicleOwner> {
    const owner = await this.ownerRepository.findOne({ where: { id } });
    if (!owner) throw new NotFoundException(`Owner with ID ${id} not found`);
    return owner;
  }

  createOwner(dto: CreateExternalVehicleOwnerDto): Promise<ExternalVehicleOwner> {
    return this.ownerRepository.save(this.ownerRepository.create(dto));
  }

  async updateOwner(id: number, dto: UpdateExternalVehicleOwnerDto): Promise<ExternalVehicleOwner> {
    const owner = await this.findOwner(id);
    Object.assign(owner, dto);
    return this.ownerRepository.save(owner);
  }

  async removeOwner(id: number): Promise<void> {
    const owner = await this.findOwner(id);
    const inUse = await this.vehicleRepository.count({ where: { owner_id: id } });
    if (inUse > 0) {
      throw new ConflictException(`Owner is linked to ${inUse} vehicle(s) and cannot be deleted`);
    }
    await this.ownerRepository.remove(owner);
  }
}
