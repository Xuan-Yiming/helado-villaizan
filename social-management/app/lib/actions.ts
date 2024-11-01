'use server'

import { Post } from "./types";

import { get_social_account, load_post_by_id, update_post_status } from '@/app/lib/database';

import { SIDENAV_ITEMS_SURVY, SIDENAV_ITEMS_MOD, SIDENAV_ITEMS, SIDENAV_ITEMS_USER, ROLE_ALLOWED_PATHS } from "./constants";
import { promises } from "dns";


export async function tiktok_send_video_by_id(id: string){
    if (!id) {
        throw new Error('Missing post ID');
    }

    try {
        const post = await load_post_by_id(id);
        if (!post) {
            console.log('Post not found');
            throw new Error('Post not found');
        }

        const account = await get_social_account('tiktok');

        if (!account) {
            console.log('TikTok account not linked');
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
                    "privacy_level": "SELF_ONLY",
                    "disable_duet": false,
                    "disable_comment": true,
                    "disable_stitch": false,
                    "video_cover_timestamp_ms": 1000
                },
                "source_info": {
                        "source": "PULL_FROM_URL",
                        "video_url": post.media![0],
                }
            })
        });

        if (response.ok) {
            console.log('Post published');
            // update_post_status(id, 'publicado')
            if (post.status !== 'publicado') {
                update_post_status(post.id, 'publicado')
            }
        } else {
            console.log('Error loading post');
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
            console.log('TikTok account not linked');
            throw new Error('TikTok account not linked');
        }

        console.log('Initial Post');
        const response = await fetch(process.env.TIKTOK_API_URL + '/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${account.token_autenticacion}`,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "post_info": {
                    "title": post.content,
                    "privacy_level": "SELF_ONLY",
                    "disable_duet": false,
                    "disable_comment": true,
                    "disable_stitch": false,
                    "video_cover_timestamp_ms": 1000
                },
                "source_info": {
                        "source": "PULL_FROM_URL",
                        "video_url": post.media![0],
                }
            })
        });

        if (response.ok) {
            console.log('Post published');
            if (post.status !== 'publicado') {
                update_post_status(post.id, 'publicado')
            }
            return response;
            // update_post_status(post.id, 'publicado')
        } else {
            console.log(response.json);
            throw new Error('Error loading post');
        }
    } catch (error:any) {
        console.log('Error publishing post: ', error.message);
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

export async function get_side_nav(rol: string){
    switch (rol) {
        case 'admin':
            return SIDENAV_ITEMS;
        case 'user':
            return SIDENAV_ITEMS_USER;
        case 'moderator':
            return SIDENAV_ITEMS_MOD;
        case 'survy_creator':
            return SIDENAV_ITEMS_SURVY;
        default:
            throw new Error('Invalid role');
    }
}

export async function can_access_path(role: string, path: string): Promise<boolean> {

    console.log
    (`Checking access for role: ${role} and path: ${path}`);

    if (role === "admin")
        return true;

    const allowedPaths = ROLE_ALLOWED_PATHS[role];
    if (!allowedPaths) {
        throw new Error('Invalid role');
    }
    console.log("Result: ", allowedPaths.includes(path))
    return allowedPaths.includes(path);
}