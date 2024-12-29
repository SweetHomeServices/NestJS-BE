import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Lead } from './lead.entity';
import { KnowledgeBase } from './knowledgebase.entity';

export class WorkingHoursDay {
  closed: boolean;
  opens: string;
  closes: string;
}

export class WorkingHours {
  monday: WorkingHoursDay;
  tuesday: WorkingHoursDay;
  wednesday: WorkingHoursDay;
  thursday: WorkingHoursDay;
  friday: WorkingHoursDay;
  saturday: WorkingHoursDay;
  sunday: WorkingHoursDay;
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column()
  timezone: string;

  @Column({ name: 'campaign_phone' })
  campaignPhone: string;

  @Column({ name: 'admin_phone' })
  adminPhone: string;

  @Column({ name: 'after_hours_message', type: 'text' })
  afterHoursMessage: string;

  @Column({ type: 'jsonb', name: 'working_hours' })
  workingHours: WorkingHours;

  @ManyToOne(() => Client, client => client.campaigns)
  client: Client;

  @ManyToOne(() => KnowledgeBase, knowledgeBase => knowledgeBase.campaigns)
  knowledgeBase: KnowledgeBase;

  @OneToMany(() => Lead, lead => lead.campaign)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}