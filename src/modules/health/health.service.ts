import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpWrapperService } from 'src/common/http-wrapper.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  constructor(private readonly http: HttpWrapperService) {}

  getStatus() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  async probeExternal() {
    try {
      const { data, error } = await this.http.get('/quote', {
        params: { symbol: 'AAPL' },
      });
      if (error) {
        this.logger.error(`fetchQuote failed: ${error.message}`);
        throw new InternalServerErrorException('Unable to fetch quote');
      }
      return { externalApi: data ? 'reachable' : 'unreachable' };
    } catch {
      return { externalApi: 'unreachable' };
    }
  }
}
