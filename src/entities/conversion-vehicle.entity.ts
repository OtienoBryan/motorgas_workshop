import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ConversionClient } from './conversion-client.entity';

@Entity('conversion_vehicles')
export class ConversionVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conversion_client_id', type: 'int' })
  conversion_client_id: number;

  @ManyToOne(() => ConversionClient)
  @JoinColumn({ name: 'conversion_client_id' })
  conversionClient?: ConversionClient;

  @Column({ type: 'varchar', length: 50 })
  registration_number: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  vin_serial_number?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vehicle_type?: string;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  make?: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trim_option?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  transmission_type?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  driven_wheel?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  engine?: string;

  @Column({ type: 'int', nullable: true })
  current_odo?: number;

  @Column({ type: 'enum', enum: ['KM', 'Miles'], default: 'KM' })
  odo_unit: 'KM' | 'Miles';

  @Column({ type: 'varchar', length: 50, nullable: true })
  color?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  unit_number?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photo_url?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
