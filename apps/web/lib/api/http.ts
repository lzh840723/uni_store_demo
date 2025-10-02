function resolveBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ?? '';
  }

  const candidates = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.API_BASE_URL,
    process.env.APP_URL
  ];

  const base = candidates.find((value) => typeof value === 'string' && value.length > 0) ?? 'http://localhost:3000';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = resolveBaseUrl();
  const url = baseUrl ? new URL(path, baseUrl).toString() : path;
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text}`);
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const raw = await response.text();
    return raw as unknown as T;
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return resolveBaseUrl();
}
