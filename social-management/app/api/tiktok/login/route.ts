'use server';

export async function GET(req: Request) {
    const csrfState = process.env.CSRF_STATE;

    // TikTok OAuth URL with your client key and redirect URL
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = encodeURIComponent('https://helado-villaizan.vercel.app/api/tiktok/auth/callback');
    const state = csrfState;
    const scope = [
        'user.info.basic',
        'video.upload',
        'video.publish',
        'video.list',
        'user.info.profile',
    ];

    // TikTok's OAuth URL to initiate login
    const tiktokOauthUrl = process.env.TIKTOK_AUTH_API_URL 
        + `?client_key=${clientKey}`
        + `&scope=${scope.join(',')}`
        + `&response_type=code`
        + `&redirect_uri=${redirectUri}`
        + `&state=${state}`;

    console.log('TikTok OAuth URL:', tiktokOauthUrl);

    // Return redirect response
    return new Response(null, {
        status: 302,
        headers: {
            Location: tiktokOauthUrl,
            'Access-Control-Allow-Origin': '*', // Include CORS headers
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
