import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('tiktok_access_token', '', { maxAge: -1 });  // Expire the cookie
    response.cookies.set('tiktok_open_id', '', { maxAge: -1 });  // Expire the cookie
    return response;
}
