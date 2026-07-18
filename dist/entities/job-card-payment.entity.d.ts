import { JobCard } from './job-card.entity';
export declare class JobCardPayment {
    id: number;
    job_card_id: number;
    jobCard?: JobCard;
    amount: number;
    payment_method: 'cash' | 'mobile_money' | 'card' | 'bank_transfer' | 'cheque' | 'other';
    reference?: string | null;
    payment_date: string;
    notes?: string | null;
    created_at: Date;
}
