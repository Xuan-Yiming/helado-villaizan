'use client';

import { add_social_account } from '@/app/lib/database'; // Importamos la función de la BD
import { SocialAccount } from '@/app/lib/types'; // Importamos el tipo SocialAccount

// Extender la interfaz Window para incluir las propiedades FB y fbAsyncInit
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

// Inicializa el SDK de Meta
export function initMetaSdk() {
    if (typeof window !== 'undefined' && !window.FB) {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1175119930457893', // Reemplaza con tu App ID de Meta
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

// Función para abrir el login del SDK y obtener los datos de autenticación
export async function metaLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
        window.FB.login(function (response: any) {
            if (response.authResponse) {
                console.log('Login exitoso:', response);
                resolve(response.authResponse);
            } else {
                console.log('El usuario canceló el login o no autorizó.');
                reject('El usuario canceló el login o no autorizó.');
            }
        }, {
            scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,pages_manage_metadata,business_management,instagram_basic,instagram_manage_insights,instagram_content_publish',
        });
    });
}

// Función para gestionar la cuenta de Meta y guardarla en la BD
export async function handleMetaAccount(authResponse: any): Promise<void> {
    const { accessToken, userID } = authResponse;

    try {
        // Obtener las páginas del usuario
        const pagesResponse = await new Promise<any>((resolve, reject) =>
            window.FB.api('/me/accounts', 'GET', { access_token: accessToken }, (res: any) => {
                if (res && !res.error) {
                    resolve(res);
                } else {
                    reject(res.error);
                }
            })
        );

        const pages = pagesResponse.data;
        if (pages.length > 0) {
            const page = pages[0]; // Primera página como ejemplo
            const pageAccessToken = page.access_token;
            const pageId = page.id;
            const pageName = page.name || 'Página Meta';
        
            // Crear el objeto SocialAccount para Facebook
            const facebookAccount: SocialAccount = {
                red_social: 'facebook',
                usuario: pageName,
                tipo_autenticacion: 'OAuth2',
                page_id: pageId,
                open_id: userID,
                refresh_token: '',
                token_autenticacion: pageAccessToken,
                instagram_business_account: '', // No aplica aquí
                fecha_expiracion_token: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Fecha ajustada
                linked: true,
            };
        
            try {
                // Guardar la cuenta de Facebook en la BD
                await add_social_account(facebookAccount);
                console.log('Cuenta de Facebook guardada exitosamente en la BD.');
            } catch (error) {
                console.error('Error al guardar la cuenta en la BD:', error);
            }
        } else {
            console.log('No se encontraron páginas asociadas al usuario.');
        }
        
        
    } catch (error) {
        console.error('Error al gestionar la cuenta de Meta:', error);
    }
}
