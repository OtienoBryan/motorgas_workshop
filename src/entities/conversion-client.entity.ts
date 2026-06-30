import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('conversion_clients')
export class ConversionClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50 })
  contact: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 191, nullable: true })
  region: string | null;

  @Column({ type: 'enum', enum: ['individual', 'company'], default: 'individual' })
  category: 'individual' | 'company';

  @Column({ type: 'varchar', length: 50, nullable: true })
  tax_pin: string | null;

  @Column({ type: 'int', default: 1 })
  is_active: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
