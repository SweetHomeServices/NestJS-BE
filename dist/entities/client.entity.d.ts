import { Campaign } from './campaign.entity';
import { Lead } from './lead.entity';
export declare class Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    campaigns: Campaign[];
    leads: Lead[];
    createdAt: Date;
    updatedAt: Date;
}
