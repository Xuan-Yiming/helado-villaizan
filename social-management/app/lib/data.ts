'use server'

import { Post } from "./types";

export async function load_posts(offset: number, limit: number,redSocial: string, tipoPublicacion: string, estado: string, tags: string): Promise<Post[]> {
  var apiUrl = `https://api.example.com/posts?offset=${offset}&limit=${limit}&redSocial=${redSocial}&tipoPublicacion=${tipoPublicacion}&estado=${estado}&tags=${tags}`;

  // for test
  apiUrl = "https://mocki.io/v1/8bf11121-29f2-4ea9-ad68-bc38e3f38612"

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Error fetching posts: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as Post[];
}

export async function load_post_by_id(postId: string): Promise<Post> {
    const apiUrl = `https://api.example.com/posts/${postId}`;
  
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Post;
  }

export async function create_post(newPost: Omit<Post, 'id'>): Promise<Post> {
    const apiUrl = `https://api.example.com/posts`;
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    });
  
    if (!response.ok) {
      throw new Error(`Error creating post: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Post;
  }