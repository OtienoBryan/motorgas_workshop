export declare class Part {
    id: number;
    part_number: string;
    name: string;
    description?: string | null;
    category?: string | null;
    manufacturer?: string | null;
    unit_price?: number | null;
    stock_quantity?: number | null;
    min_stock_level?: number | null;
    location?: string | null;
    unit?: string | null;
    purchase_cost?: number | null;
    selling_price?: number | null;
    status?: string | null;
    notes?: string | null;
    created_at: Date;
    updated_at: Date;
}
