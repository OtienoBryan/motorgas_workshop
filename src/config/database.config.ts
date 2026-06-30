import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory, Station, FuelPrice } from '../entities';
import { Client } from '../entities/client.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Aircraft } from '../entities/aircraft.entity';
import { Destination } from '../entities/destination.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { Passenger } from '../entities/passenger.entity';
import { Booking } from '../entities/booking.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { ClientLedger } from '../entities/client-ledger.entity';
import { SalesOrder } from '../entities/sales-order.entity';
import { SalesOrderItem } from '../entities/sales-order-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { Task } from '../entities/task.entity';
import { Crew } from '../entities/crew.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Inventory } from '../entities/inventory.entity';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { Sale } from '../entities/sale.entity';
import { Conversion } from '../entities/conversion.entity';
import { ConversionClient } from '../entities/conversion-client.entity';
import { ConversionVehicle } from '../entities/conversion-vehicle.entity';
import { Part } from '../entities/part.entity';
import { PartCategory } from '../entities/part-category.entity';
import { Vendor } from '../entities/vendor.entity';
import { VendorLedger } from '../entities/vendor-ledger.entity';
import { PartPurchaseOrder } from '../entities/part-purchase-order.entity';
import { PartPurchaseOrderItem } from '../entities/part-purchase-order-item.entity';
import { Store } from '../entities/store.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
      entities: [Staff, Department, ChatRoom, ChatMessage, Notice, Country, SalesRep, Region, Route, LoginHistory, Station, FuelPrice, Client, Product, Category, Aircraft, Destination, FlightSeries, SeatReservation, Passenger, Booking, BookingPassenger, ClientLedger, SalesOrder, SalesOrderItem, Supplier, PurchaseOrder, PurchaseOrderItem, Task, Crew, KeyAccount, KeyAccountLedger, Vehicle, Inventory, InventoryLedger, Sale, Conversion, ConversionClient, ConversionVehicle, Part, PartCategory, Vendor, VendorLedger, PartPurchaseOrder, PartPurchaseOrderItem, Store],
  synchronize: false, // Disabled to avoid schema conflicts
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
});
