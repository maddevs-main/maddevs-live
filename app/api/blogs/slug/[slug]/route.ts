import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const authHeader = request.headers.get('authorization') || '';

    const response = await fetch(`http://localhost:4000/api/blogs/slug/${params.slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {

    return NextResponse.json({ error: 'Proxy error', details: err.message }, { status: 500 });
  }
}
