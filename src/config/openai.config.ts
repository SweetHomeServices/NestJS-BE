import OpenAI from "openai";
import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";

config();
const configService = new ConfigService();

const apiKey = configService.get('OPENAI_API_KEY');
const openai = new OpenAI({apiKey});

export default openai;