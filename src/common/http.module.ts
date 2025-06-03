// src/common/http.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './http-wrapper.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        baseURL: cs.get('STOCK_API_BASE_URL'),
        timeout: 5_000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HttpWrapperService],
  exports: [HttpWrapperService],
})
export class SharedHttpModule {}
