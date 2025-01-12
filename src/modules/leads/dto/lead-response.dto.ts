export class LeadResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    additionalInfo: Record<string, any>;
    source: string;
    text: string;
    status: string;
}
