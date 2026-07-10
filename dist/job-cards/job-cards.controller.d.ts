import { JobCardsService } from './job-cards.service';
import { JobCard } from '../entities/job-card.entity';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { UpdateJobCardDto } from './dto/update-job-card.dto';
export declare class JobCardsController {
    private readonly jobCardsService;
    constructor(jobCardsService: JobCardsService);
    findAll(conversionVehicleId?: string): Promise<JobCard[]>;
    findOne(id: number): Promise<JobCard>;
    create(createJobCardDto: CreateJobCardDto): Promise<JobCard>;
    update(id: number, updateJobCardDto: UpdateJobCardDto): Promise<JobCard>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
