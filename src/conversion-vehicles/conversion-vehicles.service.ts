import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversionVehicle } from '../entities/conversion-vehicle.entity';
import { ConversionClient } from '../entities/conversion-client.entity';
import { CreateConversionVehicleDto } from './dto/create-conversion-vehicle.dto';
import { UpdateConversionVehicleDto } from './dto/update-conversion-vehicle.dto';

@Injectable()
export class ConversionVehiclesService {
  constructor(
    @InjectRepository(ConversionVehicle)
    private conversionVehicleRepository: Repository<ConversionVehicle>,
    @InjectRepository(ConversionClient)
    private conversionClientRepository: Repository<ConversionClient>,
  ) {}

  async findAll(): Promise<ConversionVehicle[]> {
    return this.conversionVehicleRepository.find({
      relations: ['conversionClient'],
      order: { created_at: 'DESC' },
    });
  }

  async findByConversionClient(conversionClientId: number): Promise<ConversionVehicle[]> {
    return this.conversionVehicleRepository.find({
      where: { conversion_client_id: conversionClientId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ConversionVehicle> {
    const vehicle = await this.conversionVehicleRepository.findOne({
      where: { id },
      relations: ['conversionClient'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Conversion vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async create(createConversionVehicleDto: CreateConversionVehicleDto): Promise<ConversionVehicle> {
    const conversionClient = await this.conversionClientRepository.findOne({
      where: { id: createConversionVehicleDto.conversion_client_id },
    });

    if (!conversionClient) {
      throw new NotFoundException(`Conversion client with ID ${createConversionVehicleDto.conversion_client_id} not found`);
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
      photo_url: createConversionVehicleDto.photo_url || createConversionVehicleDto.photo_urls?.[0],
      photo_urls: createConversionVehicleDto.photo_urls,
    });

    return this.conversionVehicleRepository.save(vehicle);
  }

  async update(id: number, updateConversionVehicleDto: UpdateConversionVehicleDto): Promise<ConversionVehicle> {
    const vehicle = await this.findOne(id);

    if (
      updateConversionVehicleDto.registration_number &&
      updateConversionVehicleDto.registration_number !== vehicle.registration_number
    ) {
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
    if (updateConversionVehicleDto.photo_urls) {
      vehicle.photo_url = updateConversionVehicleDto.photo_url || updateConversionVehicleDto.photo_urls[0] || null;
    }
    return this.conversionVehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.conversionVehicleRepository.remove(vehicle);
  }
}
