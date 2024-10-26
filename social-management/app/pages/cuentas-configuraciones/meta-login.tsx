'use client';
import { add_social_account } from '@/app/lib/database'; // Importamos la función para la BD
import { SocialAccount } from '@/app/lib/types'; // Importamos el tipo SocialAccount

declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

export function initMetaSdk() {
    if (typeof window !== 'undefined' && !window.FB) {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1175119930457893',
                cookie: true,
                xfbml: true,
                version: 'v20.0',
            });
            window.FB.XFBML.parse();
        };

        (function (d, s, id) {
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            const js = d.createElement(s) as HTMLScriptElement;
            js.id = id;
            js.src = "https://connect.facebook.net/es_ES/sdk.js";
            if (fjs && fjs.parentNode) fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }
}

export async function metaLogin() {
    return new Promise((resolve, reject) => {
        window.FB.login(async (response: any) => {
            if (response.authResponse) {
                const { accessToken } = response.authResponse;
                console.log('Login exitoso:', response);
                resolve(accessToken);
            } else {
                reject('El usuario canceló el login.');
            }
        }, { scope: 'public_profile,email' });
    });
}
