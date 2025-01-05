import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false, // Disable synchronize in production
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
 
  extra: {
    // Pool configuration
    max: 20,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
  }
}));