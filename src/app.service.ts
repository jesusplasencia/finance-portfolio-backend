import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(HttpService.name);
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async apiProbe() {
    const res = await firstValueFrom(this.httpService
      .get("https://api.example.com/ping")
      .pipe(catchError((error: AxiosError) => {
        this.logger.error(error.response?.data);
        throw 'An error happened!';
      })
      ));
    return { externalApi: res?.status === 200 ? "reachable" : "down" }
  }
}
