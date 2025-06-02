import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HttpService.name);
  constructor(private readonly http: HttpService) { }

  getStatus() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  async probeExternal() {
    try {
      const res = await firstValueFrom(this.http
        .get('/quote', { params: { symbol: 'AAPL' } })
        .pipe(catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'An error happened!';
        })));
      return { externalApi: res.status === 200 ? 'reachable' : 'unreachable' };
    } catch {
      return { externalApi: 'unreachable' };
    }
  }
}
