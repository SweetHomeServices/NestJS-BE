import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Campaign } from './campaign.entity';
import { ChatMessage } from './chat-message.entity';

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

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  additionalInfo: Record<string, any>;

  @Column({ nullable: true })
  text: string;

  @Column({ default: 'new' })
  status: string;

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