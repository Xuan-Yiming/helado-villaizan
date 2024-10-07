'use server';

export async function GET(req: Request) {
    const csrfState = process.env.CSRF_STATE

    // TikTok OAuth URL with your client key and redirect URL
    const clientKey = process.env.TIKTOK_CLIENT_KEY ; // Replace with actual client key
    const redirectUri = encodeURIComponent('https://helado-villaizan.vercel.app/api/tiktok/auth/callback');
    const state = csrfState; // Used to prevent CSRF attacks (can be random string)
    const scope = [
        'user.info.basic',
        'video.upload',
        'video.publish',
        'video.list',
    ]
    // TikTok's OAuth URL to initiate login
    const tiktokOauthUrl = process.env.TIKTOK_AUTH_API_URL 
    +`?`
    +`client_key=${clientKey}`
    +`&scope=${scope.join(',')}`
    +`&response_type=code`
    +`&redirect_uri=${redirectUri}`;
     +`&state=${state}`;

    console.log('TikTok OAuth URL:', tiktokOauthUrl);
    // Redirect to TikTok OAuth URL
    return Response.redirect(tiktokOauthUrl);
};

