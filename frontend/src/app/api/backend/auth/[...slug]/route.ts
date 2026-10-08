import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function proxyRequest(request: NextRequest, slug: string[]) {
  const path = `/api/auth/${slug.join('/')}${request.nextUrl.search}`;
  const url = `${BACKEND_URL}${path}`;
  
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');
  
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    headers.set('cookie', cookieHeader);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    credentials: 'include',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      init.body = formData;
      headers.delete('content-type');
    } else {
      init.body = await request.text();
    }
  }

  try {
    const response = await fetch(url, init);
    
    const responseHeaders = new Headers(response.headers);
    const setCookie = response.headers.get('set-cookie');
    
    const data = await response.arrayBuffer();
    
    const nextResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Backend connection failed' },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug);
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug);
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return proxyRequest(request, params.slug);
}