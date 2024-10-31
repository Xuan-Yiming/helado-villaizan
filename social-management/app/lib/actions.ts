'use server'

import { Post } from "./types";

import { get_social_account, load_post_by_id } from '@/app/lib/database';

export async function tiktok_send_video_by_id(id: string){
    if (!id) {
        throw new Error('Missing post ID');
    }

    try {
        const post = await load_post_by_id(id);
        if (!post) {
            throw new Error('Post not found');
        }

        const account = await get_social_account('tiktok');

        if (!account) {
            throw new Error('TikTok account not linked');
        }

        const response = await fetch(process.env.TIKTOK_API_URL + '/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.token_autenticacion}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "post_info": {
                    "title": post.content,
                    "privacy_level": "MUTUAL_FOLLOW_FRIENDS",
                    "disable_duet": false,
                    "disable_comment": true,
                    "disable_stitch": false,
                    "video_cover_timestamp_ms": 1000
                },
                "source_info": {
                        "source": "PULL_FROM_URL",
                        "video_url": post.media,
                }
            })
        });

        if (response.ok) {
            throw new Error('Error publishing post');
        } else {
            throw new Error('Error loading post');
        }
    } catch (error) {
        throw new Error('Error publishing post');
    }
}

export async function tiktok_send_video_by_post(post: Post){
    if (!post) {
        throw new Error('Missing post ');
    }

    try {
        const account = await get_social_account('tiktok');

        if (!account) {
            throw new Error('TikTok account not linked');
        }

        const response = await fetch(process.env.TIKTOK_API_URL + '/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.token_autenticacion}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "post_info": {
                    "title": post.content,
                    "privacy_level": "MUTUAL_FOLLOW_FRIENDS",
                    "disable_duet": false,
                    "disable_comment": true,
                    "disable_stitch": false,
                    "video_cover_timestamp_ms": 1000
                },
                "source_info": {
                        "source": "PULL_FROM_URL",
                        "video_url": post.media,
                }
            })
        });

        if (response.ok) {
            throw new Error('Error publishing post');
        } else {
            throw new Error('Error loading post');
        }
    } catch (error) {
        throw new Error('Error publishing post');
    }
}


export async function check_password_requirement(password:string, password_confirmation:string){
    if (!password || !password_confirmation) {
        throw new Error('Falta la contraseña');
    }

    if (password !== password_confirmation) {
        throw new Error('Las contraseñas no coinciden');
    }

    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[a-z]/.test(password)) {
        throw new Error('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[0-9]/.test(password)) {
        throw new Error('La contraseña debe contener al menos un número');
    }

}