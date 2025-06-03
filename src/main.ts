import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}

// handle any errors from bootstrap:
bootstrap().catch((err) => {
  // log the error
  // you can also use a logger here if you have one configured
  console.error('Fatal error during bootstrap:', err);
  // exit with failure
  process.exit(1);
});
