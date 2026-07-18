import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JobCardPaymentsService } from './job-card-payments.service';
import { JobCardPayment } from '../entities/job-card-payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateJobCardPaymentDto } from './dto/create-job-card-payment.dto';

@Controller('job-cards/:jobCardId/payments')
@UseGuards(JwtAuthGuard)
export class JobCardPaymentsController {
  constructor(private readonly jobCardPaymentsService: JobCardPaymentsService) {}

  @Get()
  async findAll(@Param('jobCardId', ParseIntPipe) jobCardId: number): Promise<JobCardPayment[]> {
    return this.jobCardPaymentsService.findAllForJobCard(jobCardId);
  }

  @Post()
  async create(
    @Param('jobCardId', ParseIntPipe) jobCardId: number,
    @Body() dto: CreateJobCardPaymentDto,
  ): Promise<JobCardPayment> {
    return this.jobCardPaymentsService.create(jobCardId, dto);
  }
}
