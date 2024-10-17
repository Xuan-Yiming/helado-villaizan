import { Post } from "./types";

export async function load_posts(page: number, redSocial: string, tipoPublicacion: string, estado: string, tags: string) {
    const pageSize = 20;
    const apiUrl = `https://api.example.com/posts?page=${page}&pageSize=${pageSize}&redSocial=${redSocial}&tipoPublicacion=${tipoPublicacion}&estado=${estado}&tags=${tags}`;
  
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