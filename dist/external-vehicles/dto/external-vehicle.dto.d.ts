import type { ExternalVehicleFuelType } from '../../entities/external-vehicle.entity';
export declare class CreateExternalVehicleDto {
    registration_number: string;
    make: string;
    model: string;
    fuel_type: ExternalVehicleFuelType;
    location?: string;
    owner_id: number;
}
declare const UpdateExternalVehicleDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateExternalVehicleDto>>;
export declare class UpdateExternalVehicleDto extends UpdateExternalVehicleDto_base {
}
export declare class CreateExternalVehicleOwnerDto {
    ownership_type: 'individual' | 'company' | 'sacco';
    name: string;
    id_number?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    address?: string;
}
declare const UpdateExternalVehicleOwnerDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateExternalVehicleOwnerDto>>;
export declare class UpdateExternalVehicleOwnerDto extends UpdateExternalVehicleOwnerDto_base {
}
export {};
