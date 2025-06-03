// src/common/http.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './http-wrapper.service';
import { STOCK_API_HOST, STOCK_API_BASE_PATH } from './constants';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        baseURL:
          (cs.get<string>('STOCK_API_HOST') ?? STOCK_API_HOST) +
          (cs.get<string>('STOCK_API_BASE_PATH') ?? STOCK_API_BASE_PATH),
        timeout: 5000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [HttpWrapperService],
  exports: [HttpWrapperService],
})
export class SharedHttpModule {}
