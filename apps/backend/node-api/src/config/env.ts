import 'dotenv/config';

const required = ['PORT', 'DATABASE_URL', 'JWT_SECRET'] as const;

type RequiredKey = (typeof required)[number];

type Config = {
  port: number;
  databaseUrl: string;
  redisUrl?: string;
  jwtSecret: string;
  appUrl: string;
  unleashUrl?: string;
  unleashToken?: string;
  flags: Record<string, boolean>;
};

function ensureEnv(key: RequiredKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (typeof value === 'undefined') return fallback;
  return ['1', 'true', 'on', 'yes'].includes(value.toLowerCase());
}

export const config: Config = {
  port: Number(process.env.PORT ?? 9101),
  databaseUrl: ensureEnv('DATABASE_URL'),
  redisUrl: process.env.REDIS_URL,
  jwtSecret: ensureEnv('JWT_SECRET'),
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  unleashUrl: process.env.UNLEASH_URL,
  unleashToken: process.env.UNLEASH_API_TOKEN,
  flags: {
    commerce: parseBoolean(process.env.FLAG_COMMERCE, true),
    cms: parseBoolean(process.env.FLAG_CMS, true),
    analytics: parseBoolean(process.env.FLAG_ANALYTICS, true)
  }
};
