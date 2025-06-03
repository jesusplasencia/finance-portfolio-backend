import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { StockModule } from './modules/stock/stock.module';
import awsSecretsLoader from './config/aws-secrets.loader';
import { SharedHttpModule } from './common/http.module';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsSecretsLoader],
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        AWS_REGION: Joi.string().required(),
        STAGE: Joi.string()
          .valid('local', 'dev', 'qa', 'preprod', 'prod')
          .default('local'),
      }),
      expandVariables: true,
    }),
    SharedHttpModule,
    HealthModule,
    StockModule,
  ],
})
export class AppModule {}
