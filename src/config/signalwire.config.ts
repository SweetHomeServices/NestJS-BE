import { SignalWire } from "@signalwire/realtime-api";
import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";

config();
const configService = new ConfigService();

const signalwire = SignalWire({
    project: configService.get('SIGNALWIRE_PROJECT_ID'),
    token: configService.get('SIGNALWIRE_API_TOKEN'),
  });


export default signalwire;