import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Station } from '../entities/station.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { ConversionVehicle } from '../entities/conversion-vehicle.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

export interface WeeklyReportVehicle {
  key: string;
  vehicleId: number | null;
  conversionVehicleId: number | null;
  regNo: string;
  org: string;
  driver: string;
  tel: string;
  daily: Record<string, number>;
  totalQuantity: number;
  totalAmount: number;
}

export interface WeeklySalesReport {
  startDate: string;
  endDate: string;
  vehicles: WeeklyReportVehicle[];
}

export interface FuelReportVehicle {
  key: string;
  vehicleId: number | null;
  conversionVehicleId: number | null;
  regNo: string;
  org: string;
  driver: string;
  tel: string;
  dailyFills: Record<string, number>;
  totalFills: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface VehicleFuelReport {
  startDate: string;
  endDate: string;
  vehicles: FuelReportVehicle[];
}

export interface SalesListParams {
  page?: number;
  pageSize?: number;
  stationId?: number;
  keyAccountId?: number;
  conversionClientId?: number;
  /** Business-day range, YYYY-MM-DD (a day runs 07:00 → 07:00). */
  startDate?: string;
  endDate?: string;
  shift?: 'shift1' | 'shift2';
  search?: string;
}

export interface DailySalesTotal {
  /** Business day, YYYY-MM-DD */
  date: string;
  totalSales: number;
  totalQuantity: number;
  totalRevenue: number;
}

export interface SalesListResult {
  data: Sale[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    totalSales: number;
    totalQuantity: number;
    totalRevenue: number;
    uniqueVehicles: number;
  };
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ConversionVehicle)
    private conversionVehicleRepository: Repository<ConversionVehicle>,
  ) {}

  async create(createDto: CreateSaleDto): Promise<Sale> {
    console.log('💰 [SalesService] Creating sale');
    
    // Verify station exists
    const station = await this.stationRepository.findOne({
      where: { id: createDto.stationId }
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${createDto.stationId} not found`);
    }

    // Create sale entry
    const saleData: Partial<Sale> = {
      stationId: createDto.stationId,
      clientType: createDto.clientType,
      quantity: createDto.quantity,
      unitPrice: createDto.unitPrice,
      totalAmount: createDto.totalAmount,
      saleDate: new Date(createDto.saleDate),
    };

    // Add optional fields only if they have values
    if (createDto.keyAccountId) {
      saleData.keyAccountId = createDto.keyAccountId;
    }
    if (createDto.vehicleId) {
      saleData.vehicleId = createDto.vehicleId;
    }
    if (createDto.referenceNumber) {
      saleData.referenceNumber = createDto.referenceNumber;
    }
    if (createDto.notes) {
      saleData.notes = createDto.notes;
    }
    if (createDto.imagePath) {
      saleData.imagePath = createDto.imagePath;
    }
    if (createDto.createdBy) {
      saleData.createdBy = createDto.createdBy;
    }

    const sale = this.saleRepository.create(saleData);
    const savedSale = await this.saleRepository.save(sale);
    
    console.log(`✅ [SalesService] Sale created with ID: ${savedSale.id}`);

    // Reload with relations
    const saleWithRelations = await this.saleRepository.findOne({
      where: { id: savedSale.id },
      relations: ['station', 'keyAccount', 'vehicle', 'conversionClient', 'conversionVehicle']
    });

    return saleWithRelations || savedSale;
  }

  async findAll(stationId?: number, keyAccountId?: number, conversionClientId?: number): Promise<Sale[]> {
    console.log('💰 [SalesService] Finding all sales');

    const where: any = {};
    if (stationId) {
      where.stationId = stationId;
    }
    if (keyAccountId) {
      where.keyAccountId = keyAccountId;
    }
    if (conversionClientId) {
      where.conversionClientId = conversionClientId;
    }

    const sales = await this.saleRepository.find({
      where,
      relations: ['station', 'keyAccount', 'vehicle', 'conversionClient', 'conversionVehicle'],
      order: { saleDate: 'DESC' },
    });
    
    console.log(`✅ [SalesService] Found ${sales.length} sales`);
    return sales;
  }

  private joinSaleRelations<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    return qb
      .leftJoin('sale.station', 'station')
      .leftJoin('sale.keyAccount', 'keyAccount')
      .leftJoin('sale.vehicle', 'vehicle')
      .leftJoin('sale.conversionClient', 'conversionClient')
      .leftJoin('sale.conversionVehicle', 'conversionVehicle');
  }

  // A business day runs 07:00 → 07:00, so [startDate, endDate] maps to
  // sale_date in [startDate 07:00, endDate+1 07:00). Plain comparisons keep the sale_date index usable.
  private applySalesListFilters<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    p: SalesListParams,
    joined: boolean,
  ): SelectQueryBuilder<T> {
    if (p.stationId) qb.andWhere('sale.stationId = :stationId', { stationId: p.stationId });
    if (p.keyAccountId) qb.andWhere('sale.keyAccountId = :keyAccountId', { keyAccountId: p.keyAccountId });
    if (p.conversionClientId) qb.andWhere('sale.conversionClientId = :conversionClientId', { conversionClientId: p.conversionClientId });

    const fmt = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ');
    const at7am = (day: string, plusDays = 0) => {
      const [y, m, d] = day.split('-').map(Number);
      return fmt(new Date(Date.UTC(y, m - 1, d + plusDays, 7)));
    };
    if (p.startDate) qb.andWhere('sale.saleDate >= :rangeStart', { rangeStart: at7am(p.startDate) });
    if (p.endDate) qb.andWhere('sale.saleDate < :rangeEnd', { rangeEnd: at7am(p.endDate, 1) });

    // Shift 1: 07:00–18:59, Shift 2: 19:00–06:59
    if (p.shift === 'shift1') qb.andWhere('HOUR(sale.saleDate) BETWEEN 7 AND 18');
    if (p.shift === 'shift2') qb.andWhere('(HOUR(sale.saleDate) < 7 OR HOUR(sale.saleDate) >= 19)');

    const search = p.search?.trim();
    if (search) {
      const q = `%${search}%`;
      qb.andWhere(
        new Brackets(w => {
          w.where('sale.referenceNumber LIKE :q', { q })
            .orWhere('sale.notes LIKE :q')
            .orWhere('sale.clientType LIKE :q');
          if (joined) {
            w.orWhere('station.name LIKE :q')
              .orWhere('keyAccount.name LIKE :q')
              .orWhere('conversionClient.name LIKE :q')
              .orWhere('vehicle.registration_number LIKE :q')
              .orWhere('vehicle.model LIKE :q')
              .orWhere('conversionVehicle.registration_number LIKE :q')
              .orWhere('conversionVehicle.model LIKE :q');
          }
        }),
      );
    }
    return qb;
  }

  async findPaginated(p: SalesListParams): Promise<SalesListResult> {
    const page = Math.max(1, p.page || 1);
    const pageSize = Math.min(5000, Math.max(1, p.pageSize || 10));

    // Only the columns the table renders are pulled from the joined tables
    // (conversion_vehicles in particular carries large JSON/document columns).
    const dataQuery = this.applySalesListFilters(
      this.joinSaleRelations(this.saleRepository.createQueryBuilder('sale'))
        .addSelect(['station.id', 'station.name'])
        .addSelect(['keyAccount.id', 'keyAccount.name'])
        .addSelect(['vehicle.id', 'vehicle.registration_number', 'vehicle.model'])
        .addSelect(['conversionClient.id', 'conversionClient.name'])
        .addSelect(['conversionVehicle.id', 'conversionVehicle.registration_number', 'conversionVehicle.model', 'conversionVehicle.photo_url']),
      p,
      true,
    )
      .orderBy('sale.saleDate', 'DESC')
      .addOrderBy('sale.id', 'DESC')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    // Totals cover every matching row (not just this page). The joins are only needed for text search.
    const summaryBase = this.saleRepository.createQueryBuilder('sale');
    const hasSearch = !!p.search?.trim();
    const summaryQuery = this.applySalesListFilters(
      hasSearch ? this.joinSaleRelations(summaryBase) : summaryBase,
      p,
      hasSearch,
    ).select('COUNT(DISTINCT sale.id)', 'totalSales')
      .addSelect('COALESCE(SUM(sale.quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'totalRevenue')
      // vehicle_id and conversion_vehicle_id are independent id spaces, so the key carries its type
      .addSelect(
        "COUNT(DISTINCT CASE WHEN sale.vehicleId IS NOT NULL THEN CONCAT('v-', sale.vehicleId) " +
          "WHEN sale.conversionVehicleId IS NOT NULL THEN CONCAT('cv-', sale.conversionVehicleId) END)",
        'uniqueVehicles',
      );

    const [data, raw] = await Promise.all([dataQuery.getMany(), summaryQuery.getRawOne()]);

    return {
      data,
      total: Number(raw?.totalSales) || 0,
      page,
      pageSize,
      summary: {
        totalSales: Number(raw?.totalSales) || 0,
        totalQuantity: Number(raw?.totalQuantity) || 0,
        totalRevenue: Number(raw?.totalRevenue) || 0,
        uniqueVehicles: Number(raw?.uniqueVehicles) || 0,
      },
    };
  }

  // One row per business day (07:00 → 07:00) for the same filters the sales list accepts.
  async getDailyTotals(p: SalesListParams): Promise<DailySalesTotal[]> {
    const hasSearch = !!p.search?.trim();
    const base = this.saleRepository.createQueryBuilder('sale');
    const rows = await this.applySalesListFilters(hasSearch ? this.joinSaleRelations(base) : base, p, hasSearch)
      .select("DATE_FORMAT(DATE_SUB(sale.saleDate, INTERVAL 7 HOUR), '%Y-%m-%d')", 'day')
      .addSelect('COUNT(DISTINCT sale.id)', 'totalSales')
      .addSelect('COALESCE(SUM(sale.quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(sale.totalAmount), 0)', 'totalRevenue')
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();

    return rows.map(r => ({
      date: r.day as string,
      totalSales: Number(r.totalSales) || 0,
      totalQuantity: Number(r.totalQuantity) || 0,
      totalRevenue: Number(r.totalRevenue) || 0,
    }));
  }

  async getWeeklyReport(
    startDate: string,
    endDate: string,
    stationId?: number,
  ): Promise<WeeklySalesReport> {
    console.log(`💰 [SalesService] Weekly report ${startDate} → ${endDate}${stationId ? ` (station ${stationId})` : ''}`);

    const start = new Date(`${startDate}T00:00:00`);
    const endExclusive = new Date(`${endDate}T00:00:00`);
    endExclusive.setDate(endExclusive.getDate() + 1);

    const qb = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoin('sale.vehicle', 'vehicle')
      .leftJoin('vehicle.keyAccount', 'keyAccount')
      .leftJoin('sale.conversionVehicle', 'conversionVehicle')
      .leftJoin('sale.conversionClient', 'conversionClient')
      .select('sale.vehicle_id', 'vehicleId')
      .addSelect('sale.conversion_vehicle_id', 'conversionVehicleId')
      .addSelect('COALESCE(vehicle.registration_number, conversionVehicle.registration_number)', 'regNo')
      .addSelect('keyAccount.name', 'org')
      .addSelect('COALESCE(vehicle.driver_name, conversionClient.name)', 'driver')
      .addSelect('COALESCE(vehicle.driver_contact, conversionClient.contact)', 'tel')
      .addSelect('DATE(sale.sale_date)', 'day')
      .addSelect('SUM(sale.quantity)', 'quantity')
      .addSelect('SUM(sale.total_amount)', 'amount')
      .where('sale.sale_date >= :start', { start })
      .andWhere('sale.sale_date < :end', { end: endExclusive })
      .groupBy('sale.vehicle_id')
      .addGroupBy('sale.conversion_vehicle_id')
      .addGroupBy('vehicle.registration_number')
      .addGroupBy('conversionVehicle.registration_number')
      .addGroupBy('keyAccount.name')
      .addGroupBy('vehicle.driver_name')
      .addGroupBy('vehicle.driver_contact')
      .addGroupBy('conversionClient.name')
      .addGroupBy('conversionClient.contact')
      .addGroupBy('DATE(sale.sale_date)');

    if (stationId) {
      qb.andWhere('sale.station_id = :stationId', { stationId });
    }

    const rows = await qb.getRawMany();

    const toDayString = (value: unknown): string => {
      if (value instanceof Date) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return String(value).slice(0, 10);
    };

    const vehicleMap = new Map<string, WeeklyReportVehicle>();
    for (const row of rows) {
      const vehicleId = row.vehicleId ? Number(row.vehicleId) : null;
      const conversionVehicleId = row.conversionVehicleId ? Number(row.conversionVehicleId) : null;
      const key = vehicleId ? `v-${vehicleId}` : conversionVehicleId ? `cv-${conversionVehicleId}` : 'unassigned';

      let entry = vehicleMap.get(key);
      if (!entry) {
        const anyId = vehicleId ?? conversionVehicleId;
        entry = {
          key,
          vehicleId,
          conversionVehicleId,
          regNo: row.regNo || (anyId ? `Vehicle #${anyId}` : 'No Vehicle'),
          org: row.org || '',
          driver: row.driver || '',
          tel: row.tel || '',
          daily: {},
          totalQuantity: 0,
          totalAmount: 0,
        };
        vehicleMap.set(key, entry);
      }
      const day = toDayString(row.day);
      const quantity = Number(row.quantity) || 0;
      entry.daily[day] = (entry.daily[day] || 0) + quantity;
      entry.totalQuantity += quantity;
      entry.totalAmount += Number(row.amount) || 0;
    }

    const vehicles = Array.from(vehicleMap.values()).sort((a, b) => {
      const aUnassigned = a.vehicleId === null && a.conversionVehicleId === null;
      const bUnassigned = b.vehicleId === null && b.conversionVehicleId === null;
      if (aUnassigned) return 1;
      if (bUnassigned) return -1;
      return a.regNo.localeCompare(b.regNo);
    });

    console.log(`✅ [SalesService] Weekly report built for ${vehicles.length} vehicles`);
    return { startDate, endDate, vehicles };
  }

  async getFuelReport(
    startDate: string,
    endDate: string,
    stationId?: number,
  ): Promise<VehicleFuelReport> {
    console.log(`⛽ [SalesService] Fuel report ${startDate} → ${endDate}${stationId ? ` (station ${stationId})` : ''}`);

    const start = new Date(`${startDate}T00:00:00`);
    const endExclusive = new Date(`${endDate}T00:00:00`);
    endExclusive.setDate(endExclusive.getDate() + 1);

    // Per-vehicle per-day fueling aggregates from the sales table.
    // Vehicle details come from the vehicle tables below, so no joins needed.
    const qb = this.saleRepository
      .createQueryBuilder('sale')
      .select('sale.vehicle_id', 'vehicleId')
      .addSelect('sale.conversion_vehicle_id', 'conversionVehicleId')
      .addSelect('DATE(sale.sale_date)', 'day')
      .addSelect('COUNT(*)', 'fills')
      .addSelect('SUM(sale.quantity)', 'quantity')
      .addSelect('SUM(sale.total_amount)', 'amount')
      .where('sale.sale_date >= :start', { start })
      .andWhere('sale.sale_date < :end', { end: endExclusive })
      .groupBy('sale.vehicle_id')
      .addGroupBy('sale.conversion_vehicle_id')
      .addGroupBy('DATE(sale.sale_date)');

    if (stationId) {
      qb.andWhere('sale.station_id = :stationId', { stationId });
    }

    const [rows, kaVehicles, convVehicles] = await Promise.all([
      qb.getRawMany(),
      this.vehicleRepository.find({ relations: ['keyAccount'] }),
      this.conversionVehicleRepository.find({ relations: ['conversionClient'] }),
    ]);

    const toDayString = (value: unknown): string => {
      if (value instanceof Date) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      return String(value).slice(0, 10);
    };

    // Seed with EVERY vehicle so ones that never fueled still appear
    // (that's how low-fueling vehicles are identified).
    const vehicleMap = new Map<string, FuelReportVehicle>();
    for (const v of kaVehicles) {
      vehicleMap.set(`v-${v.id}`, {
        key: `v-${v.id}`,
        vehicleId: v.id,
        conversionVehicleId: null,
        regNo: v.registration_number,
        org: v.keyAccount?.name || '',
        driver: v.driver_name || '',
        tel: v.driver_contact || '',
        dailyFills: {},
        totalFills: 0,
        totalQuantity: 0,
        totalAmount: 0,
      });
    }
    for (const v of convVehicles) {
      vehicleMap.set(`cv-${v.id}`, {
        key: `cv-${v.id}`,
        vehicleId: null,
        conversionVehicleId: v.id,
        regNo: v.registration_number,
        org: v.conversionClient?.organization_name || '',
        driver: v.conversionClient?.name || '',
        tel: v.conversionClient?.contact || '',
        dailyFills: {},
        totalFills: 0,
        totalQuantity: 0,
        totalAmount: 0,
      });
    }

    for (const row of rows) {
      const vehicleId = row.vehicleId ? Number(row.vehicleId) : null;
      const conversionVehicleId = row.conversionVehicleId ? Number(row.conversionVehicleId) : null;
      const key = vehicleId ? `v-${vehicleId}` : conversionVehicleId ? `cv-${conversionVehicleId}` : 'unassigned';

      let entry = vehicleMap.get(key);
      if (!entry) {
        // A sale with no vehicle link, or a vehicle deleted since the sale
        const anyId = vehicleId ?? conversionVehicleId;
        entry = {
          key,
          vehicleId,
          conversionVehicleId,
          regNo: anyId ? `Vehicle #${anyId}` : 'No Vehicle',
          org: '',
          driver: '',
          tel: '',
          dailyFills: {},
          totalFills: 0,
          totalQuantity: 0,
          totalAmount: 0,
        };
        vehicleMap.set(key, entry);
      }
      const day = toDayString(row.day);
      const fills = Number(row.fills) || 0;
      entry.dailyFills[day] = (entry.dailyFills[day] || 0) + fills;
      entry.totalFills += fills;
      entry.totalQuantity += Number(row.quantity) || 0;
      entry.totalAmount += Number(row.amount) || 0;
    }

    const vehicles = Array.from(vehicleMap.values()).sort((a, b) => {
      const aUnassigned = a.vehicleId === null && a.conversionVehicleId === null;
      const bUnassigned = b.vehicleId === null && b.conversionVehicleId === null;
      if (aUnassigned) return 1;
      if (bUnassigned) return -1;
      return a.regNo.localeCompare(b.regNo);
    });

    console.log(`✅ [SalesService] Fuel report built for ${vehicles.length} vehicles`);
    return { startDate, endDate, vehicles };
  }

  async findOne(id: number): Promise<Sale> {
    console.log(`💰 [SalesService] Finding sale by ID: ${id}`);
    
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['station', 'keyAccount', 'vehicle', 'conversionClient', 'conversionVehicle']
    });
    
    if (!sale) {
      console.log(`❌ [SalesService] Sale with ID ${id} not found`);
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    console.log(`✅ [SalesService] Sale found`);
    return sale;
  }
}

