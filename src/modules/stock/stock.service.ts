import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpClientService } from 'src/common/http/http-client.service';
import { mapError } from 'src/common/utils';
import { DictionaryService } from '../dictionary';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);
  constructor(
    private readonly http: HttpClientService,
    private readonly dict: DictionaryService,
  ) {}

  async fetchQuote(symbol: string) {
    // validate symbol first
    if (!this.dict.exists(symbol)) {
      throw new NotFoundException(
        'Stock quote not available or symbol incorrect.',
      );
    }
    // Get From Finhub
    const { data, error } = await this.http.get('/quote', {
      symbol: symbol.toUpperCase(),
    });
    // Catch Erros
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
