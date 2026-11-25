import { SalesService, WeeklySalesReport, VehicleFuelReport, SalesListResult, DailySalesTotal } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createDto: CreateSaleDto): Promise<Sale>;
    findAll(stationId?: string, keyAccountId?: string, conversionClientId?: string): Promise<Sale[]>;
    private parseListQuery;
    findPaginated(query: Record<string, string | undefined>): Promise<SalesListResult>;
    getDailyTotals(query: Record<string, string | undefined>): Promise<DailySalesTotal[]>;
    getWeeklyReport(startDate?: string, endDate?: string, stationId?: string): Promise<WeeklySalesReport>;
    getFuelReport(startDate?: string, endDate?: string, stationId?: string): Promise<VehicleFuelReport>;
    findOne(id: number): Promise<Sale>;
}
