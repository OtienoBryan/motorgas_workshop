import { ExternalVehiclesService } from './external-vehicles.service';
import { CreateExternalVehicleDto, UpdateExternalVehicleDto, CreateExternalVehicleOwnerDto, UpdateExternalVehicleOwnerDto } from './dto/external-vehicle.dto';
export declare class ExternalVehiclesController {
    private readonly service;
    constructor(service: ExternalVehiclesService);
    findOwners(type?: string): Promise<(import("../entities/external-vehicle-owner.entity").ExternalVehicleOwner & {
        vehicle_count: number;
    })[]>;
    createOwner(dto: CreateExternalVehicleOwnerDto): Promise<import("../entities/external-vehicle-owner.entity").ExternalVehicleOwner>;
    updateOwner(id: number, dto: UpdateExternalVehicleOwnerDto): Promise<import("../entities/external-vehicle-owner.entity").ExternalVehicleOwner>;
    removeOwner(id: number): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("../entities/external-vehicle.entity").ExternalVehicle[]>;
    findOne(id: number): Promise<import("../entities/external-vehicle.entity").ExternalVehicle>;
    create(dto: CreateExternalVehicleDto): Promise<import("../entities/external-vehicle.entity").ExternalVehicle>;
    update(id: number, dto: UpdateExternalVehicleDto): Promise<import("../entities/external-vehicle.entity").ExternalVehicle>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
