import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const x = await fetch('http://localhost:3000/api/test', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return NextResponse.json(await x.json());
}
