import { Repository } from 'typeorm';
import { JobCard } from '../entities/job-card.entity';
import { JobCardItem } from '../entities/job-card-item.entity';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { UpdateJobCardDto } from './dto/update-job-card.dto';
export declare class JobCardsService {
    private jobCardRepository;
    private jobCardItemRepository;
    constructor(jobCardRepository: Repository<JobCard>, jobCardItemRepository: Repository<JobCardItem>);
    findAll(conversionVehicleId?: number): Promise<JobCard[]>;
    findOne(id: number): Promise<JobCard>;
    create(dto: CreateJobCardDto): Promise<JobCard>;
    update(id: number, dto: UpdateJobCardDto): Promise<JobCard>;
    remove(id: number): Promise<void>;
    private replaceItems;
}
