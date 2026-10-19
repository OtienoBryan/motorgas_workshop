import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ExternalVehiclesService } from './external-vehicles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateExternalVehicleDto,
  UpdateExternalVehicleDto,
  CreateExternalVehicleOwnerDto,
  UpdateExternalVehicleOwnerDto,
} from './dto/external-vehicle.dto';

@Controller('external-vehicles')
@UseGuards(JwtAuthGuard)
export class ExternalVehiclesController {
  constructor(private readonly service: ExternalVehiclesService) {}

  // Owner routes are declared before ':id' so 'owners' isn't parsed as an id
  @Get('owners')
  findOwners(@Query('type') type?: string) {
    return this.service.findAllOwners(type);
  }

  @Post('owners')
  createOwner(@Body() dto: CreateExternalVehicleOwnerDto) {
    return this.service.createOwner(dto);
  }

  @Put('owners/:id')
  updateOwner(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExternalVehicleOwnerDto) {
    return this.service.updateOwner(id, dto);
  }

  @Delete('owners/:id')
  async removeOwner(@Param('id', ParseIntPipe) id: number) {
    await this.service.removeOwner(id);
    return { message: 'Owner deleted successfully' };
  }

  @Get()
  findAll() {
    return this.service.findAllVehicles();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findVehicle(id);
  }

  @Post()
  create(@Body() dto: CreateExternalVehicleDto) {
    return this.service.createVehicle(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExternalVehicleDto) {
    return this.service.updateVehicle(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.removeVehicle(id);
    return { message: 'External vehicle deleted successfully' };
  }
}
