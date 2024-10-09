import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('google_access_token', '', { maxAge: -1 });  // Expire the cookie
    response.cookies.set('google_open_id', '', { maxAge: -1 });  // Expire the cookie
    return response;
}
