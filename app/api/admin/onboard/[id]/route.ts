import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization') || '';
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    let url = '';
    if (action === 'approve') {
      url = `http://localhost:4000/api/onboard/${params.id}/approve`;
    } else if (action === 'done') {
      url = `http://localhost:4000/api/onboard/${params.id}/done`;
    } else {
      return NextResponse.json(
        { error: 'Invalid action', message: 'Action must be either "approve" or "done"' },
        { status: 400 }
      );
    }
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('Admin onboard PATCH API proxy error:', err);
    return NextResponse.json(
      { error: 'Proxy error', details: err.message },
      { status: 500 }
    );
  }
} 