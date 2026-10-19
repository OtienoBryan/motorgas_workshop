import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExternalVehicleOwner } from './external-vehicle-owner.entity';

export const EXTERNAL_VEHICLE_FUEL_TYPES = ['Petrol', 'Diesel', 'LPG', 'Petrol/LPG', 'Hybrid', 'Electric'] as const;
export type ExternalVehicleFuelType = (typeof EXTERNAL_VEHICLE_FUEL_TYPES)[number];

@Entity('external_vehicles')
export class ExternalVehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  registration_number: string;

  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'enum', enum: EXTERNAL_VEHICLE_FUEL_TYPES })
  fuel_type: ExternalVehicleFuelType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ name: 'owner_id', type: 'int' })
  owner_id: number;

  @ManyToOne(() => ExternalVehicleOwner)
  @JoinColumn({ name: 'owner_id' })
  owner?: ExternalVehicleOwner;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
