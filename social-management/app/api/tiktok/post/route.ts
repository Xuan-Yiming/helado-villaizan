'use server'
import { NextResponse } from 'next/server';

import { tiktok_send_video_by_id } from '@/app/lib/actions';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }
    try {
        const response = await tiktok_send_video_by_id(id);
        return response;
    }catch(error){
        return NextResponse.json({ error: 'Error sending video' }, { status: 400 });
    }
}