'use server'
import { NextResponse } from 'next/server';

import { tiktok_send_video_by_id, tiktok_send_video_by_post } from '@/app/lib/actions';
import { Post } from '@/app/lib/types';

export async function POST(request: Request) {
    const post: Post = await request.json();
    // //console.log('Post:', post);
    if (!post) {
        //console.log('Missing post');
        return NextResponse.json({ error: 'Missing post' }, { status: 400 });
    }
    try {
        const response = await tiktok_send_video_by_post(post);
        return response;
    }catch(error){
        return NextResponse.json({ error: 'Error sending video' }, { status: 401 });
    }
}