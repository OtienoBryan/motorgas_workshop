import { Repository } from 'typeorm';
import { ExternalVehicle } from '../entities/external-vehicle.entity';
import { ExternalVehicleOwner } from '../entities/external-vehicle-owner.entity';
import { CreateExternalVehicleDto, UpdateExternalVehicleDto, CreateExternalVehicleOwnerDto, UpdateExternalVehicleOwnerDto } from './dto/external-vehicle.dto';
export declare class ExternalVehiclesService {
    private vehicleRepository;
    private ownerRepository;
    constructor(vehicleRepository: Repository<ExternalVehicle>, ownerRepository: Repository<ExternalVehicleOwner>);
    findAllVehicles(): Promise<ExternalVehicle[]>;
    findVehicle(id: number): Promise<ExternalVehicle>;
    private normalizeReg;
    private assertOwnerExists;
    private assertRegistrationFree;
    createVehicle(dto: CreateExternalVehicleDto): Promise<ExternalVehicle>;
    updateVehicle(id: number, dto: UpdateExternalVehicleDto): Promise<ExternalVehicle>;
    removeVehicle(id: number): Promise<void>;
    findAllOwners(type?: string): Promise<(ExternalVehicleOwner & {
        vehicle_count: number;
    })[]>;
    findOwner(id: number): Promise<ExternalVehicleOwner>;
    createOwner(dto: CreateExternalVehicleOwnerDto): Promise<ExternalVehicleOwner>;
    updateOwner(id: number, dto: UpdateExternalVehicleOwnerDto): Promise<ExternalVehicleOwner>;
    removeOwner(id: number): Promise<void>;
}
