export declare class CreateConversionClientDto {
    name: string;
    email?: string;
    contact: string;
    address?: string;
    region?: string;
    category?: 'individual' | 'company';
    tax_pin?: string;
    is_active?: number;
}
