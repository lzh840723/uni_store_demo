import { NextRequest, NextResponse } from 'next/server';

export async function readJson<T>(request: NextRequest): Promise<T | undefined> {
  try {
    return (await request.json()) as T;
  } catch (error) {
    console.warn('[api] failed to parse JSON body', error);
    return undefined;
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}
