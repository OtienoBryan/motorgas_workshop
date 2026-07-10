import { ConversionClient } from './conversion-client.entity';
import { ConversionVehicle } from './conversion-vehicle.entity';
import { JobCardItem } from './job-card-item.entity';
export declare class JobCard {
    id: number;
    conversion_client_id?: number | null;
    conversionClient?: ConversionClient;
    conversion_vehicle_id?: number | null;
    conversionVehicle?: ConversionVehicle;
    status: 'open' | 'in_progress' | 'completed' | 'closed';
    vat_enabled: number;
    vat_rate: number;
    discount: number;
    other_charges: number;
    amount_paid: number;
    notes?: string | null;
    items?: JobCardItem[];
    created_at: Date;
    updated_at: Date;
}
