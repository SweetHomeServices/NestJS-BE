import { Client } from './client.entity';
import { Lead } from './lead.entity';
export declare class Campaign {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    settings: Record<string, any>;
    client: Client;
    leads: Lead[];
    createdAt: Date;
    updatedAt: Date;
}
