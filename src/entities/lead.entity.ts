import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Campaign } from './campaign.entity';
import { ChatMessage } from './chat-message.entity';
import { LeadSource } from '../modules/leads/dto/lead-source.enum';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({default: 'NA' })
  zipcode: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, any>;

  @Column({ nullable: true })
  text: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ default: LeadSource.OTHER })
  source: string;

  @ManyToOne(() => Client, client => client.leads)
  client: Client;

  @ManyToOne(() => Campaign, campaign => campaign.leads)
  campaign: Campaign;

  @OneToMany(() => ChatMessage, message => message.lead, { cascade: true })
  messages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}