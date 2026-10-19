export type OwnershipType = 'individual' | 'company' | 'sacco';
export declare class ExternalVehicleOwner {
    id: number;
    ownership_type: OwnershipType;
    name: string;
    id_number?: string | null;
    contact_person?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    created_at: Date;
    updated_at: Date;
}
