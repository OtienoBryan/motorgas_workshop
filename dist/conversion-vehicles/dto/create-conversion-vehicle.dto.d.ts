export declare class CreateConversionVehicleDto {
    conversion_client_id: number;
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
    odo_unit?: 'KM' | 'Miles';
    color?: string;
    unit_number?: string;
    notes?: string;
    photo_url?: string;
}
