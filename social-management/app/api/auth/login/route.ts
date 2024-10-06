import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    // para pruebas
    const test = true;
    // Replace with your external API URL for authentication
    const externalAuthApiUrl = 'https://mocki.io/v1/469ff47e-8d39-4adb-a6c8-5ac5ec21ec75';

    try {
        if (test) {
            // Call the external API to get the auth_token
            const response = await axios.get(externalAuthApiUrl);
            const auth_token = response.data.auth_token;
            console.log('Token:', auth_token);
            console.log('Response:', response.status);
            // Use the auth_token for further processing
            // ...
            if (response.status === 200 && response.data.auth_token) {
                const res = NextResponse.json({ success: true, auth_token });
                res.cookies.set('auth_token', auth_token, { httpOnly: true, maxAge: 60 * 60 * 24 });
                console.log('Token:', auth_token);
                return res;
            }
            else {
                return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
            }
        } else {
            const response = await axios.post(externalAuthApiUrl, { email, password });

            if (response.status === 200 && response.data.auth_token) {
                // Successful authentication, return the token or set a cookie
                const auth_token = response.data.auth_token;

                // You can set a cookie or send the token to the client
                const res = NextResponse.json({ success: true, auth_token });
                res.cookies.set('auth_token', auth_token, { httpOnly: true, maxAge: 60 * 60 * 24 });
                console.log('Token:', auth_token);
                return res;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
            }
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
    }
}