import { ConversionClient } from './conversion-client.entity';
export declare class ConversionVehicle {
    id: number;
    conversion_client_id: number;
    conversionClient?: ConversionClient;
    registration_number: string;
    vin_serial_number?: string;
    vehicle_type?: string;
    year?: number;
    make?: string;
    model: string;
    trim_option?: string;
    transmission_type?: string;
    driven_wheel?: string;
    engine?: string;
    current_odo?: number;
    odo_unit: 'KM' | 'Miles';
    color?: string;
    unit_number?: string;
    notes?: string;
    photo_url?: string;
    created_at: Date;
    updated_at: Date;
}
