import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OwnershipType = 'individual' | 'company' | 'sacco';

@Entity('external_vehicle_owners')
export class ExternalVehicleOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['individual', 'company', 'sacco'], default: 'individual' })
  ownership_type: OwnershipType;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  id_number?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_person?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
