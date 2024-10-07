'use server';

export async function GET(req: Request) {
    const csrfState = process.env.CSRF_STATE

    // TikTok OAuth URL with your client key and redirect URL
    const clientKey = process.env.TIKTOK_CLIENT_KEY ; // Replace with actual client key
    const redirectUri = encodeURIComponent('http://localhost:3000/api/tiktok/callback');
    const state = csrfState; // Used to prevent CSRF attacks (can be random string)

    // TikTok's OAuth URL to initiate login
    const tiktokOauthUrl = process.env.TIKTOK_AUTH_API_URL 
    +`?`
    +`client_key=${clientKey}`
    +`&scope=video.publish`
    +`&response_type=code`
    +`&redirect_uri=${redirectUri}`
    +`&state=${state}`;

    console.log('TikTok OAuth URL:', tiktokOauthUrl);
    // Redirect to TikTok OAuth URL
    return Response.redirect(tiktokOauthUrl);
};

