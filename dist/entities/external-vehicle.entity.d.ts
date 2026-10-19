import { ExternalVehicleOwner } from './external-vehicle-owner.entity';
export declare const EXTERNAL_VEHICLE_FUEL_TYPES: readonly ["Petrol", "Diesel", "LPG", "Petrol/LPG", "Hybrid", "Electric"];
export type ExternalVehicleFuelType = (typeof EXTERNAL_VEHICLE_FUEL_TYPES)[number];
export declare class ExternalVehicle {
    id: number;
    registration_number: string;
    make: string;
    model: string;
    fuel_type: ExternalVehicleFuelType;
    location?: string | null;
    owner_id: number;
    owner?: ExternalVehicleOwner;
    created_at: Date;
    updated_at: Date;
}
