import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalVehiclesService } from './external-vehicles.service';
import { ExternalVehiclesController } from './external-vehicles.controller';
import { ExternalVehicle } from '../entities/external-vehicle.entity';
import { ExternalVehicleOwner } from '../entities/external-vehicle-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalVehicle, ExternalVehicleOwner])],
  controllers: [ExternalVehiclesController],
  providers: [ExternalVehiclesService],
})
export class ExternalVehiclesModule {}
