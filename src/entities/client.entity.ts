import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Lead } from './lead.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Campaign, campaign => campaign.client)
  campaigns: Campaign[];

  @OneToMany(() => Lead, lead => lead.client)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}