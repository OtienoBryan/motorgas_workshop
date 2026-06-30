import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Part } from '../entities/part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Part)
    private partRepository: Repository<Part>,
  ) {}

  async findAll(): Promise<Part[]> {
    console.log('📦 [PartsService] Finding all parts');
    
    const parts = await this.partRepository.find({
      order: { created_at: 'DESC' },
    });
    
    console.log(`✅ [PartsService] Found ${parts.length} parts`);
    return parts;
  }

  async findOne(id: number): Promise<Part> {
    console.log(`📦 [PartsService] Finding part by ID: ${id}`);
    
    const part = await this.partRepository.findOne({
      where: { id },
    });
    
    if (!part) {
      throw new NotFoundException(`Part with ID ${id} not found`);
    }
    
    return part;
  }

  async create(createPartDto: CreatePartDto): Promise<Part> {
    console.log('📦 [PartsService] Creating new part:', createPartDto.part_number);
    
    // Check if part number already exists
    const existingPart = await this.partRepository.findOne({
      where: { part_number: createPartDto.part_number },
    });
    
    if (existingPart) {
      throw new Error(`Part number ${createPartDto.part_number} already exists`);
    }
    
    try {
      const part = this.partRepository.create({
        part_number: createPartDto.part_number,
        name: createPartDto.name,
        description: createPartDto.description || null,
        category: createPartDto.category || null,
        manufacturer: createPartDto.manufacturer || null,
        unit_price: createPartDto.unit_price || null,
        stock_quantity: createPartDto.stock_quantity || 0,
        min_stock_level: createPartDto.min_stock_level || 0,
        location: createPartDto.location || null,
      });
      
      const savedPart = await this.partRepository.save(part);
      console.log(`✅ [PartsService] Part created with ID: ${savedPart.id}`);
      
      return savedPart;
    } catch (error) {
      console.error('❌ [PartsService] Error creating part:', error);
      throw error;
    }
  }

  async update(id: number, updatePartDto: UpdatePartDto): Promise<Part> {
    console.log(`📦 [PartsService] Updating part with ID: ${id}`);
    
    const part = await this.findOne(id);
    
    // If part_number is being updated, check for duplicates
    if (updatePartDto.part_number && updatePartDto.part_number !== part.part_number) {
      const existingPart = await this.partRepository.findOne({
        where: { part_number: updatePartDto.part_number },
      });
      
      if (existingPart) {
        throw new Error(`Part number ${updatePartDto.part_number} already exists`);
      }
    }
    
    Object.assign(part, updatePartDto);
    const updatedPart = await this.partRepository.save(part);
    console.log(`✅ [PartsService] Part updated: ${updatedPart.part_number}`);
    
    return updatedPart;
  }

  async remove(id: number): Promise<void> {
    console.log(`📦 [PartsService] Deleting part with ID: ${id}`);
    
    const part = await this.findOne(id);
    await this.partRepository.remove(part);
    console.log(`✅ [PartsService] Part deleted: ${part.part_number}`);
  }
}

