import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { SharedHttpModule } from 'src/common/http.module';

@Module({
  imports: [SharedHttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
