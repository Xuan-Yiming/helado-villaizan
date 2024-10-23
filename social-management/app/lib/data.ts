'use server'

import { Post } from "./types";
import {Encuesta} from "./types";
import { Response } from "./types";
import { SocialAccount } from "./types";

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

export async function create_post(newPost: Post): Promise<Post> {
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

export async function load_programmed_posts(): Promise<Post[]> {
    var apiUrl = `https://api.example.com/posts/programmed`;
    apiUrl = "https://mocki.io/v1/8bf11121-29f2-4ea9-ad68-bc38e3f38612"
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching programmed posts: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Post[];
  }

export async function load_all_survey(offset: number, limit: number, estado: string): Promise<Encuesta[]> {
    var apiUrl = `https://api.example.com/surveys`;
    apiUrl = "https://mocki.io/v1/605b445a-03a2-4f50-b396-579224838780"
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching surveys: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Encuesta[];
  }

export async function load_survey_by_id(surveyId: string): Promise<Encuesta> {
    var apiUrl = `https://api.example.com/surveys/${surveyId}`;
    apiUrl = 'https://mocki.io/v1/28e3c6aa-7b14-4798-a1b5-90ede6b6bf8c'

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching survey: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Encuesta;
  }

export async function upload_survey(newSurvey: Encuesta): Promise<Encuesta> {
  const apiUrl = `https://api.example.com/surveys`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSurvey)
  });

  if (!response.ok) {
    throw new Error(`Error uploading survey: ${response.statusText}`);
  }

  const data = await response.json();
  return data as Encuesta;
}

export async function submit_survey_response(surveyId: string, responseQ: Response): Promise<void> {
  const apiUrl = `https://api.example.com/surveys/${surveyId}/responses`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(responseQ)
  });

  if (!response.ok) {
    throw new Error(`Error submitting survey response: ${response.statusText}`);
  }
}

export async function load_all_social_accounts(): Promise<SocialAccount[]> {
  var apiUrl = `https://api.example.com/social-accounts`;
  apiUrl = 'https://mocki.io/v1/2151a9e2-83db-40ee-b44c-8e1f37623c88'

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Error fetching social accounts: ${response.statusText}`);
  }

  const data = await response.json();
  return data as SocialAccount[];
}

export async function add_social_account(social_account:SocialAccount): Promise<void> {
  const apiUrl = `https://api.example.com/social-accounts`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(social_account)
  });

  if (!response.ok) {
    throw new Error(`Error creating social account: ${response.statusText}`);
  }
}

export async function logout_social_account(red_social:string): Promise<void> {
  const apiUrl = `https://api.example.com/social-accounts/logout`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ red_social })
  });

  if (!response.ok) {
    throw new Error(`Error logging out social account: ${response.statusText}`);
  }
}