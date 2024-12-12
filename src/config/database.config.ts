import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false, // Disable synchronize in production
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false
  },
  extra: {
    // Pool configuration
    max: 20,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
  }
}));