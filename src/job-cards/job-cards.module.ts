import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCardsService } from './job-cards.service';
import { JobCardsController } from './job-cards.controller';
import { JobCard } from '../entities/job-card.entity';
import { JobCardItem } from '../entities/job-card-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobCard, JobCardItem])],
  controllers: [JobCardsController],
  providers: [JobCardsService],
  exports: [JobCardsService],
})
export class JobCardsModule {}
