import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('knowledgebases')
export class KnowledgeBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'primary_goal' })
  primaryGoal: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'spam_filter' })
  spamFilter: string;

  @Column({ name: 'important_rules', type: 'text' })
  importantRules: string;

  @Column({ name: 'use_emoji_on_response', default: false })
  useEmojiOnResponse: boolean;

  @Column({ name: 'communication_tone' })
  communicationTone: string;

  @OneToMany(() => Campaign, campaign => campaign.knowledgeBase)
  campaigns: Campaign[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}