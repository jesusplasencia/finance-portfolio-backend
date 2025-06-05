import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpClientService } from 'src/common/http/http-client.service';
import { mapError } from 'src/common/utils';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);
  constructor(private readonly http: HttpClientService) {}

  async fetchQuote(symbol: string) {
    const { data, error } = await this.http.get('/quote', { symbol });
    if (error) {
      const { statusCode, message } = mapError(error);
      this.logger.error(`fetchQuote failed: ${message}`);
      throw new InternalServerErrorException(message, {
        cause: error,
        description: `fetchQuote failed with status ${statusCode}`,
      });
    }
    return data;
  }

  async fetchHistory(symbol: string, from: string, to: string) {
    const fromTs = Math.floor(new Date(from).getTime() / 1000);
    const toTs = Math.floor(new Date(to).getTime() / 1000);

    const { data, error } = await this.http.get('/stock/candle', {
      params: {
        symbol,
        resolution: 'D',
        from: fromTs,
        to: toTs,
      },
    });
    if (error) {
      const { statusCode, message } = mapError(error);
      this.logger.error(`fetchHistory failed: ${message}`);
      throw new InternalServerErrorException(message, {
        cause: error,
        description: `fetchHistory failed with status ${statusCode}`,
      });
    }
    return data;
  }
}
