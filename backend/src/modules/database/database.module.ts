import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabase } from '../../db';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE',
      useFactory: (configService: ConfigService) => {
        process.env.DATABASE_URL = `postgresql://${configService.get('DB_USERNAME', 'nexa_user')}:${configService.get('DB_PASSWORD', 'nexa_pass_123')}@${configService.get('DB_HOST', 'localhost')}:${configService.get('DB_PORT', '5432')}/${configService.get('DB_NAME', 'nexa_db')}`;
        return getDatabase();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
