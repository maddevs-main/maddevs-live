import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    
    const response = await fetch('http://localhost:4000/api/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('Token validation API proxy error:', err);
    return NextResponse.json(
      { error: 'Proxy error', details: err.message },
      { status: 500 }
    );
  }
} 