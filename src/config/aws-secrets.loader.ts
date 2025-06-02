// src/config/aws-secrets.loader.ts
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export default async function awsSecretsLoader() {
    const stage = process.env.STAGE ?? 'dev';
    const secretName = `stock-api/${stage}`;
    const client = new SecretsManagerClient({
        region: process.env.AWS_REGION,
    });
    const { SecretString } = await client.send(
        new GetSecretValueCommand({ SecretId: secretName }),
    );
    if (!SecretString) {
        throw new Error(
            `Secret ${secretName} returned empty string`,
        );
    }
    return JSON.parse(SecretString);
}