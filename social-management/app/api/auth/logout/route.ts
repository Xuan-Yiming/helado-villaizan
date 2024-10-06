import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', '', { maxAge: -1 });  // Expire the cookie
    return response;
}
