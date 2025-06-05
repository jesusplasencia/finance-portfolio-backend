import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HttpClientModule } from 'src/common/http';

@Module({
  imports: [HttpClientModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
