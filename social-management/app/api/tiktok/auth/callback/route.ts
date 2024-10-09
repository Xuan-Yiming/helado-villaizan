'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    console.log('TikTok get callback');
    // Make sure the 'code' exists
    if (!code) {
        return NextResponse.json({ error: 'TikTok authentication failed.' }, { status: 400 });
    }
    console.log('TikTok Authorization Code:', code);
    try {
        // Exchange the authorization code for an access token
        const response = await axios.post(process.env.TIKTOK_API_URL + '/oauth/token/', {
            client_key: process.env.TIKTOK_CLIENT_KEY,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            code: code, // Authorization code from the TikTok redirect
            grant_type: 'authorization_code',
            redirect_uri: 'https://helado-villaizan.vercel.app/api/tiktok/access-token/callback'
        });

        console.log('TikTok OAuth Response:', response.data);

        const access_token = response.data.access_token;
        const open_id = response.data.open_id;

        if (access_token) {
            // You can now link the user's TikTok account in your database or session
            // Here, you'd save the TikTok `open_id` and `access_token` to your user's profile in the database.
            console.log('TikTok Open ID:', open_id);
            console.log('TikTok Access Token:', access_token);
            // Example: Set a cookie with the TikTok account link (or store in database)
            const res = NextResponse.json({ success: true, open_id, access_token });
            res.cookies.set('tiktok_open_id', open_id, { httpOnly: true, maxAge: 60 * 60 * 24 });
            res.cookies.set('tiktok_access_token', access_token, { httpOnly: true, maxAge: 60 * 60 * 24 });
            return res;
        }

        return NextResponse.json({ error: `Failed to retrieve TikTok access token.` }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: `Error during TikTok OAuth process. Message: ${error}`  }, { status: 500 });
    }
}
