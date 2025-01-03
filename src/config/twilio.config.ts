import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";

config();
const configService = new ConfigService();

const accountSid = configService.get('TWILIO_ACCOUNT_SID');
const authToken = configService.get('TWILIO_AUTH_TOKEN');

const client = require('twilio')(accountSid, authToken);
export default client;