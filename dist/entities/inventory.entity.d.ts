import { Store } from './store.entity';
import { Part } from './part.entity';
export declare class Inventory {
    id: number;
    store_id: number;
    part_id: number;
    quantity: number;
    min_stock_level?: number | null;
    location?: string | null;
    last_updated: Date;
    store?: Store;
    part?: Part;
}
