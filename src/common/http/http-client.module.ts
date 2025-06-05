// src/common/http/http.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpClientService } from './http-client.service';
import { STOCK_API_HOST, STOCK_API_BASE_PATH } from './http.constants';

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
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
