import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.getStatus();
  }

  @Get('api-probe')
  probe() {
    return this.healthService.probeExternal();
  }
}
