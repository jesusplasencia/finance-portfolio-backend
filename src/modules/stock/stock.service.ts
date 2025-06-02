import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpWrapperService } from 'src/common/http-wrapper.service';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);
  constructor(private readonly http: HttpWrapperService) { }

  async fetchQuote(symbol: string) {
    const { data, error } = await this.http.get(
      "/quote",
      { symbol }
    );
    if (error) {
      this.logger.error(`fetchQuote failed: ${error.message}`)
      throw new InternalServerErrorException("Unable to fetch quote");
    }
    return data;
  }

  async fetchHistory(symbol: string, from: string, to: string) {
    const fromTs = Math.floor(new Date(from).getTime() / 1000);
    const toTs = Math.floor(new Date(to).getTime() / 1000);

    const { data, error } = await this.http
      .get('/stock/candle', {
        params: {
          symbol,
          resolution: 'D',
          from: fromTs,
          to: toTs,
        },
      });
    if (error) {
      this.logger.error(`fetchHistory failed: ${error.message}`)
      throw new InternalServerErrorException("Unable to fetch history");
    }
    return data;
  }
}
