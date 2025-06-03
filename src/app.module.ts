import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { STOCK_API_BASE_URL } from './common/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './common/http-wrapper.service';
import { HealthModule } from './modules/health/health.module';
import { StockModule } from './modules/stock/stock.module';
import awsSecretsLoader from './config/aws-secrets.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsSecretsLoader],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        baseURL: cs.get(`${STOCK_API_BASE_URL}`) ?? STOCK_API_BASE_URL,
        timeout: 5000,
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    StockModule,
  ],
  providers: [HttpWrapperService],
  exports: [HttpWrapperService],
})
export class AppModule {}
