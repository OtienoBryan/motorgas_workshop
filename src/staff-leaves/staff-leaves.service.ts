import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { StaffLeave } from '../entities/staff-leave.entity';

export interface FindStaffLeavesQuery {
  staffId?: number;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class StaffLeavesService {
  constructor(
    @InjectRepository(StaffLeave)
    private staffLeaveRepository: Repository<StaffLeave>,
  ) {}

  async findAll(query: FindStaffLeavesQuery): Promise<StaffLeave[]> {
    const where: Record<string, unknown> = {};

    if (query.staffId) {
      where.staff_id = query.staffId;
    }

    // Overlap query: a leave counts for the range if it starts on/before the
    // range's end AND ends on/after the range's start — return the whole leave
    // row (not clipped) so the caller can clip it to the exact window itself.
    if (query.startDate) {
      where.end_date = MoreThanOrEqual(new Date(`${query.startDate}T00:00:00`));
    }
    if (query.endDate) {
      where.start_date = LessThanOrEqual(new Date(`${query.endDate}T23:59:59.999`));
    }

    return this.staffLeaveRepository.find({
      where,
      order: { start_date: 'DESC' },
    });
  }
}
