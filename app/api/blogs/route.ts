import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization') || '';
    
    // Build query string from search params
    const queryString = searchParams.toString();
    const url = `http://localhost:4000/api/blogs${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('Blogs API proxy error:', err);
    return NextResponse.json(
      { error: 'Proxy error', details: err.message },
      { status: 500 }
    );
  }
} 