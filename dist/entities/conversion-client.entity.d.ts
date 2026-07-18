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
    referral_source: string | null;
    referral_notes: string | null;
    tax_exempt: number;
    apply_discount: number;
    discount_rate: string | null;
    labour_rate_override: number;
    labour_rate: string | null;
    parts_markup_override: number;
    parts_markup: string | null;
    payment_terms_override: number;
    payment_terms: string | null;
    is_active: number;
    created_at: Date;
    updated_at: Date;
}
