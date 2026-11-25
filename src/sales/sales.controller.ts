import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { SalesService, WeeklySalesReport, VehicleFuelReport, SalesListResult, SalesListParams, DailySalesTotal } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createDto: CreateSaleDto): Promise<Sale> {
    console.log('💰 [SalesController] POST /sales');
    console.log('💰 [SalesController] Request body:', JSON.stringify(createDto, null, 2));
    try {
      const result = await this.salesService.create(createDto);
      console.log('✅ [SalesController] Sale created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [SalesController] Error creating sale:', error);
      console.error('❌ [SalesController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('stationId') stationId?: string,
    @Query('keyAccountId') keyAccountId?: string,
    @Query('conversionClientId') conversionClientId?: string
  ): Promise<Sale[]> {
    console.log('💰 [SalesController] GET /sales');
    const station = stationId ? parseInt(stationId, 10) : undefined;
    const keyAccount = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
    const conversionClient = conversionClientId ? parseInt(conversionClientId, 10) : undefined;
    return this.salesService.findAll(station, keyAccount, conversionClient);
  }

  private parseListQuery(q: Record<string, string | undefined>): SalesListParams {
    const int = (v?: string) => (v && /^\d+$/.test(v) ? parseInt(v, 10) : undefined);
    const day = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
    return {
      page: int(q.page),
      pageSize: int(q.pageSize),
      stationId: int(q.stationId),
      keyAccountId: int(q.keyAccountId),
      conversionClientId: int(q.conversionClientId),
      startDate: day(q.startDate),
      endDate: day(q.endDate),
      shift: q.shift === 'shift1' || q.shift === 'shift2' ? q.shift : undefined,
      search: q.search,
    };
  }

  @Get('report/list')
  async findPaginated(@Query() query: Record<string, string | undefined>): Promise<SalesListResult> {
    return this.salesService.findPaginated(this.parseListQuery(query));
  }

  @Get('report/daily')
  async getDailyTotals(@Query() query: Record<string, string | undefined>): Promise<DailySalesTotal[]> {
    return this.salesService.getDailyTotals(this.parseListQuery(query));
  }

  @Get('report/weekly')
  async getWeeklyReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('stationId') stationId?: string,
  ): Promise<WeeklySalesReport> {
    console.log('💰 [SalesController] GET /sales/report/weekly');

    const today = new Date();
    const format = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // Defaults: first day of previous month → today
    const defaultStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const start = startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : format(defaultStart);
    const end = endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate) ? endDate : format(today);

    const station = stationId ? parseInt(stationId, 10) : undefined;
    return this.salesService.getWeeklyReport(start, end, station);
  }

  @Get('report/fuel')
  async getFuelReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('stationId') stationId?: string,
  ): Promise<VehicleFuelReport> {
    console.log('⛽ [SalesController] GET /sales/report/fuel');

    const today = new Date();
    const format = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // Defaults: first day of previous month → today
    const defaultStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const start = startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : format(defaultStart);
    const end = endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate) ? endDate : format(today);

    const station = stationId ? parseInt(stationId, 10) : undefined;
    return this.salesService.getFuelReport(start, end, station);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    console.log(`💰 [SalesController] GET /sales/${id}`);
    return this.salesService.findOne(id);
  }
}

