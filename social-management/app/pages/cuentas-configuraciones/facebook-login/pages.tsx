'use client';

import { useEffect, useState } from 'react';

// Extender la interfaz Window para incluir las propiedades FB y fbAsyncInit
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

interface Account {
    name: string;
    linked: boolean;
}


const initialAccounts: Account[] = [
    {
        name: 'Facebook e Instagram',
        linked: false,
    },
    {
        name: 'Tiktok',
        linked: false,
    },
    {
        name: 'Google',
        linked: false,
    },
];


export default async function Page(){
    const [facebookAccessToken, setFacebookAccessToken] = useState<string | null>(null);
    const [accountsState, setAccountsState] = useState<Account[]>(initialAccounts);

    useEffect(() => {
        // Inicializar el estado de las cuentas desde Local Storage
        const storedAccounts = localStorage.getItem('accountsState');
        if (storedAccounts) {
            try {
                const parsedAccounts: Account[] = JSON.parse(storedAccounts);
                setAccountsState(parsedAccounts);
            } catch (error) {
                console.error('Error parsing stored accounts:', error);
            }
        }

        // Inicializar el SDK de Facebook
        if (typeof window !== 'undefined' && !window.FB) {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: '1175119930457893',  // Reemplaza con tu App ID de Facebook
                    cookie: true,
                    xfbml: true,
                    version: 'v20.0',
                });
                window.FB.XFBML.parse(); 
            };

            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                const js = d.createElement(s) as HTMLScriptElement;
                js.id = id;
                js.src = "https://connect.facebook.net/es_ES/sdk.js";
                if (fjs && fjs.parentNode) {
                    fjs.parentNode.insertBefore(js, fjs);
                }
            })(document, 'script', 'facebook-jssdk');
        }
    }, []);

    window.FB.login(function (response: any) {
        if (response.authResponse) {
            const userAccessToken = response.authResponse.accessToken;
            console.log('Facebook login successful:', response);
            console.log('User Access Token:', userAccessToken);

            window.FB.api('/me/accounts', 'GET', { access_token: userAccessToken }, function (response: any) {
                if (response && !response.error) {
                    const pages = response.data;
                    if (pages.length > 0) {
                        const pageAccessToken = pages[0].access_token;
                        const pageId = pages[0].id;
            
                        setFacebookAccessToken(pageAccessToken);
                        console.log('Facebook Page Access Token:', pageAccessToken);
                        console.log('Facebook Page ID:', pageId);
            
                        // Guardar el token de acceso y el ID de la página en el Local Storage
                        localStorage.setItem('facebookAccessToken', pageAccessToken); // Asegúrate de que se esté guardando aquí
                        localStorage.setItem('facebookPageId', pageId);
            
                        // Consultar si hay una cuenta de Instagram asociada a la página de Facebook
                        window.FB.api(
                            `/${pageId}?fields=instagram_business_account`,
                            'GET',
                            { access_token: pageAccessToken },
                            function (instaResponse: any) {
                                if (instaResponse && instaResponse.instagram_business_account) {
                                    const instagramAccountId = instaResponse.instagram_business_account.id;
                                    console.log('Instagram Business Account ID:', instagramAccountId);
            
                                    // Guardar el Instagram Business Account ID en el Local Storage
                                    localStorage.setItem('instagramAccountId', instagramAccountId);
            
                                    // Actualizar el estado para mostrar que Facebook e Instagram están vinculados
                                    const updatedAccounts = accountsState.map((account) =>
                                        account.name === 'Facebook e Instagram' ? { ...account, linked: true } : account
                                    );
                                    setAccountsState(updatedAccounts);
            
                                    // Guardar el estado actualizado en Local Storage
                                    localStorage.setItem('accountsState', JSON.stringify(updatedAccounts));
                                } else {
                                    console.error('Error obteniendo la cuenta de Instagram:', instaResponse);
                                    console.log('No se encontró una cuenta de Instagram asociada.');
                                }
                            }
                        );
                    } else {
                        console.log('No se encontraron páginas administradas por el usuario.');
                    }
                } else {
                    console.error('Error obteniendo páginas del usuario:', response.error);
                }
            });                            
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,pages_manage_metadata,business_management,instagram_basic,instagram_manage_insights,instagram_content_publish' });

    return (
        <main>
            Loading...
        </main>
    );
}