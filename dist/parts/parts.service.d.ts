import { Repository } from 'typeorm';
import { Part } from '../entities/part.entity';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
export declare class PartsService {
    private partRepository;
    constructor(partRepository: Repository<Part>);
    findAll(): Promise<Part[]>;
    findOne(id: number): Promise<Part>;
    create(createPartDto: CreatePartDto): Promise<Part>;
    update(id: number, updatePartDto: UpdatePartDto): Promise<Part>;
    remove(id: number): Promise<void>;
}
