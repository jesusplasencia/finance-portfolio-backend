// src/config/aws-secrets.loader.ts
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

// Define strict type for your secret payload
export interface StockApiSecret {
  STOCK_API_KEY: string;
}

// A type-guard to narrow unknown -> StockApiSecret
function isStockApiSecret(obj: unknown): obj is StockApiSecret {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'STOCK_API_KEY' in obj &&
    typeof (obj as Record<string, unknown>).STOCK_API_KEY === 'string'
  );
}

// Loader returns exactly StockApiSecret type
export default async function awsSecretsLoader(): Promise<StockApiSecret> {
  const stage = process.env.STAGE ?? 'local';

  if (stage === 'local') {
    return {
      STOCK_API_KEY: process.env.API_KEY || '',
    };
  }

  const secretName = `stock-api/${stage}`;
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });

  const { SecretString } = await client.send(
    new GetSecretValueCommand({ SecretId: secretName }),
  );

  if (!SecretString) {
    throw new Error(`Secret ${secretName} has no SecretString`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(SecretString);
  } catch {
    throw new Error(`Secret ${secretName} is not valid JSON`);
  }

  // Validate with the type-guard
  if (!isStockApiSecret(parsed)) {
    throw new Error(
      `Secret ${secretName} must be a JSON object with a string field "STOCK_API_KEY"`,
    );
  }

  // return an object whose keys become config keys
  return {
    STOCK_API_KEY: parsed.STOCK_API_KEY,
  };
}
