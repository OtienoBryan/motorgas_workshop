import { InventoryService } from './inventory.service';
import { Inventory } from '../entities/inventory.entity';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryTransactionDto } from './dto/inventory-transaction.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(storeId?: string, partId?: string): Promise<Inventory[]>;
    getInventoryByStore(): Promise<Inventory[]>;
    getLedger(partId?: string): Promise<InventoryLedger[]>;
    findOne(id: number): Promise<Inventory>;
    create(createInventoryDto: CreateInventoryDto): Promise<Inventory>;
    recordTransaction(transactionDto: InventoryTransactionDto): Promise<{
        inventory: Inventory;
        ledger: InventoryLedger;
    }>;
    update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<Inventory>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
