import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { LeadsModule } from './modules/leads/leads.module';
import { SettingsModule } from './modules/settings/settings.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { MailModule } from './mail/mail.module';
import mailConfig from './config/mail.config';
import { ChatMessagesModule } from './modules/chat-messages/chat-messages.module';
import { S3Module } from './modules/S3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, mailConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        logging: ['error', 'warn'],
        logger: 'advanced-console'
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ClientsModule,
    CampaignsModule,
    LeadsModule,
    SettingsModule,
    KnowledgeBaseModule,
    MailModule,
    ChatMessagesModule,
    S3Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}