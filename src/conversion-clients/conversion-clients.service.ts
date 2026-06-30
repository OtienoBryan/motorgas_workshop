import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversionClient } from '../entities/conversion-client.entity';
import { CreateConversionClientDto } from './dto/create-conversion-client.dto';
import { UpdateConversionClientDto } from './dto/update-conversion-client.dto';

@Injectable()
export class ConversionClientsService {
  constructor(
    @InjectRepository(ConversionClient)
    private conversionClientRepository: Repository<ConversionClient>,
  ) {}

  async findAll(): Promise<ConversionClient[]> {
    return this.conversionClientRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<ConversionClient> {
    const client = await this.conversionClientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Conversion client with ID ${id} not found`);
    }

    return client;
  }

  async create(createConversionClientDto: CreateConversionClientDto): Promise<ConversionClient> {
    const client = this.conversionClientRepository.create({
      name: createConversionClientDto.name,
      email: createConversionClientDto.email || null,
      contact: createConversionClientDto.contact,
      address: createConversionClientDto.address || null,
      region: createConversionClientDto.region || null,
      category: createConversionClientDto.category || 'individual',
      tax_pin: createConversionClientDto.tax_pin || null,
      is_active: createConversionClientDto.is_active !== undefined ? createConversionClientDto.is_active : 1,
    });

    return this.conversionClientRepository.save(client);
  }

  async update(id: number, updateConversionClientDto: UpdateConversionClientDto): Promise<ConversionClient> {
    const client = await this.findOne(id);
    Object.assign(client, updateConversionClientDto);
    return this.conversionClientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.conversionClientRepository.remove(client);
  }
}
