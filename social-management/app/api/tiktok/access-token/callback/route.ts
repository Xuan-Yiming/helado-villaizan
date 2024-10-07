'use server'
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log('TikTok callback request:', request.url);
    return NextResponse.json({ error: 'Recived.' }, { status: 200 });
}