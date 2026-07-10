export declare class ConversionClient {
    id: number;
    name: string;
    email: string | null;
    contact: string;
    account_number: string;
    address: string | null;
    region: string | null;
    category: 'individual' | 'company';
    tax_pin: string | null;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}
