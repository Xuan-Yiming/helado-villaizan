'use server';

import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

import { SocialAccount } from '@/app/lib/types';
import { add_social_account } from '@/app/lib/data';

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
        const response = await axios.post(process.env.TIKTOK_API_URL + '/oauth/token/', qs.stringify({
            client_key: process.env.TIKTOK_CLIENT_KEY,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            code: code, // Authorization code from the TikTok redirect
            grant_type: 'authorization_code',
            redirect_uri: 'https://helado-villaizan.vercel.app/api/tiktok/auth/callback'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('TikTok OAuth Response:', response.data);

        const access_token = response.data.access_token;
        const open_id = response.data.open_id;
        const refresh_token = response.data.refresh_token;

        if (access_token) {
            // You can now link the user's TikTok account in your database or session
            // Here, you'd save the TikTok `open_id` and `access_token` to your user's profile in the database.
            console.log('TikTok Open ID:', open_id);
            console.log('TikTok Access Token:', access_token);
            console.log('TikTok Refresh Token:', refresh_token)
            // Example: Set a cookie with the TikTok account link (or store in database)

            // Create the social account object
            const socialAccount: SocialAccount = {
                red_social: 'tiktok',
                tipo_autenticacion: 'OAuth2',
                open_id: open_id,
                token_autenticacion: access_token,
                refresh_token: refresh_token,
                fecha_expiracion_token: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            console.log("tiktok account: " + JSON.stringify(socialAccount))
            // Call the function to add the social account
            await add_social_account(socialAccount);

            // Redirect to /pages/cuentas-configuraciones
            return NextResponse.redirect('https://helado-villaizan.vercel.app/pages/cuentas-configuraciones');
        }

        return NextResponse.json({ error: `Failed to retrieve TikTok access token.` }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: `Error during TikTok OAuth process. Message: ${error}`  }, { status: 500 });
    }
}
