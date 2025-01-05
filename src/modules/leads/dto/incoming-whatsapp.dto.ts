import { ApiProperty } from "@nestjs/swagger";

export class IncomingWhatsappDto {
    @ApiProperty({ example: '1234567890', description: 'Phone number of the sender' })
    From: string;

    @ApiProperty({ example: '0987654321', description: 'Phone number of the receiver' })
    To: string;

    @ApiProperty({ example: 'Hello world', description: 'Text of the message' })
    Body: string;
}