import { Client } from './client.entity';
import { Campaign } from './campaign.entity';
export declare class Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    additionalInfo: Record<string, any>;
    status: string;
    client: Client;
    campaign: Campaign;
    createdAt: Date;
    updatedAt: Date;
}
