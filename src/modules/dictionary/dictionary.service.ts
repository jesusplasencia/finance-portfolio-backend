// src/modules/stock/dictionary.service.ts
import {
  Injectable,
  OnModuleInit,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpClientService } from '../../common/http';

@Injectable()
export class DictionaryService implements OnModuleInit {
  private readonly logger = new Logger(DictionaryService.name);

  // in‐memory cache
  private symbolMap = new Map<string, string>();

  constructor(private readonly http: HttpClientService) {}

  /** Called once on startup */
  async onModuleInit() {
    await this.refreshDictionary();
  }

  /** Cron job: run at 00:05 UTC every day */
  @Cron('5 0 * * *')
  async handleDailyRefresh() {
    this.logger.log('Refreshing stock symbol dictionary');
    await this.refreshDictionary();
  }

  /** Fetch from Finnhub and repopulate the Map */
  private async refreshDictionary() {
    try {
      // Finnhub: GET /stock/symbol?exchange=US
      const { data, error } = await this.http.get<
        { symbol: string; description: string }[]
      >('/stock/symbol', { exchange: 'US' });

      if (error) {
        throw error;
      }
      this.symbolMap.clear();
      for (const entry of data) {
        // standardize symbol uppercase
        this.symbolMap.set(entry.symbol.toUpperCase(), entry.description);
      }
      this.logger.log(`Loaded ${this.symbolMap.size} symbols into dictionary`);
    } catch (err) {
      this.logger.error('Failed to refresh symbol dictionary', err);
    }
  }

  /** Get the entire lookup object */
  getAll(): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const [symbol, desc] of this.symbolMap.entries()) {
      obj[symbol] = desc;
    }
    return obj;
  }

  /** Lookup a single symbol or throw 404 */
  getName(symbol: string): string {
    const key = symbol.toUpperCase();
    const name = this.symbolMap.get(key);
    if (!name) {
      throw new NotFoundException(
        'Stock quote not available or symbol incorrect.',
      );
    }
    return name;
  }

  /** Returns true if symbol exists */
  exists(symbol: string): boolean {
    return this.symbolMap.has(symbol.toUpperCase());
  }
}
