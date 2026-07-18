import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCardPayment } from '../entities/job-card-payment.entity';
import { JobCard } from '../entities/job-card.entity';
import { CreateJobCardPaymentDto } from './dto/create-job-card-payment.dto';

@Injectable()
export class JobCardPaymentsService {
  constructor(
    @InjectRepository(JobCardPayment)
    private paymentRepository: Repository<JobCardPayment>,
    @InjectRepository(JobCard)
    private jobCardRepository: Repository<JobCard>,
  ) {}

  async findAllForJobCard(jobCardId: number): Promise<JobCardPayment[]> {
    return this.paymentRepository.find({
      where: { job_card_id: jobCardId },
      order: { payment_date: 'DESC', id: 'DESC' },
    });
  }

  async create(jobCardId: number, dto: CreateJobCardPaymentDto): Promise<JobCardPayment> {
    const jobCard = await this.jobCardRepository.findOne({ where: { id: jobCardId } });
    if (!jobCard) {
      throw new NotFoundException(`Job card with ID ${jobCardId} not found`);
    }

    const payment = this.paymentRepository.create({
      job_card_id: jobCardId,
      amount: dto.amount,
      payment_method: dto.payment_method,
      reference: dto.reference ?? null,
      payment_date: dto.payment_date,
      notes: dto.notes ?? null,
    });
    const saved = await this.paymentRepository.save(payment);

    jobCard.amount_paid = Number(jobCard.amount_paid) + Number(dto.amount);
    await this.jobCardRepository.save(jobCard);

    return saved;
  }
}
