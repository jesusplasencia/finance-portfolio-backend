import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpClientService } from 'src/common/http/http-client.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  constructor(private readonly http: HttpClientService) {}

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
