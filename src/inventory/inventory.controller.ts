import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from '../entities/inventory.entity';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryTransactionDto } from './dto/inventory-transaction.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(
    @Query('storeId') storeId?: string,
    @Query('partId') partId?: string,
  ): Promise<Inventory[]> {
    console.log('📦 [InventoryController] GET /inventory');
    
    if (storeId) {
      return this.inventoryService.findByStore(parseInt(storeId, 10));
    }
    
    if (partId) {
      return this.inventoryService.findByPart(parseInt(partId, 10));
    }
    
    return this.inventoryService.findAll();
  }

  @Get('by-store')
  async getInventoryByStore(): Promise<Inventory[]> {
    console.log('📦 [InventoryController] GET /inventory/by-store');
    return this.inventoryService.getInventoryByStore();
  }

  @Get('ledger')
  async getLedger(
    @Query('partId') partId?: string,
  ): Promise<InventoryLedger[]> {
    console.log('📦 [InventoryController] GET /inventory/ledger', partId ? `partId=${partId}` : '');
    if (partId) return this.inventoryService.findLedgerByPart(parseInt(partId, 10));
    return this.inventoryService.findLedger();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Inventory> {
    console.log(`📦 [InventoryController] GET /inventory/${id}`);
    return this.inventoryService.findOne(id);
  }

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    console.log('📦 [InventoryController] POST /inventory');
    console.log('📦 [InventoryController] Create inventory data:', createInventoryDto);
    return this.inventoryService.create(createInventoryDto);
  }

  @Post('transaction')
  async recordTransaction(@Body() transactionDto: InventoryTransactionDto): Promise<{ inventory: Inventory; ledger: InventoryLedger }> {
    console.log('📦 [InventoryController] POST /inventory/transaction');
    console.log('📦 [InventoryController] Transaction data:', transactionDto);
    return this.inventoryService.recordTransaction(transactionDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto
  ): Promise<Inventory> {
    console.log(`📦 [InventoryController] PUT /inventory/${id}`);
    console.log('📦 [InventoryController] Update inventory data:', updateInventoryDto);
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`📦 [InventoryController] DELETE /inventory/${id}`);
    await this.inventoryService.remove(id);
    return { message: 'Inventory record deleted successfully' };
  }
}
