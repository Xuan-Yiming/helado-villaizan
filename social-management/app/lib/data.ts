'use server'

const API_URL = process.env.API_URL || 'https://api.example.com';

import { Campaign, Post, Adset } from "./types";
import {Encuesta} from "./types";
import { Response } from "./types";
import { SocialAccount } from "./types";

export async function load_posts(offset: number, limit: number,redSocial: string, tipoPublicacion: string, estado: string, tags: string): Promise<Post[]> {
  //var apiUrl = `https://api.example.com/posts?offset=${offset}&limit=${limit}&redSocial=${redSocial}&tipoPublicacion=${tipoPublicacion}&estado=${estado}&tags=${tags}`;
  const apiUrl = API_URL + '/posts/';
  // for test
  //apiUrl = "https://mocki.io/v1/8bf11121-29f2-4ea9-ad68-bc38e3f38612"

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Error fetching posts: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as Post[];
}

export async function load_post_by_id(postId: string): Promise<Post> {
    const apiUrl = API_URL + `/posts/${postId}`;
  
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Post;
  }

export async function create_post(newPost: Post): Promise<Post> {
    const apiUrl = API_URL+`/posts/crear`;
    //const apiUrl = "https://dp2-back.onrender.com/posts/crear/";
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
    const apiUrl = API_URL + `/posts/programados/`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching programmed posts: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Post[];
  }

export async function load_all_survey(offset: number, limit: number, estado: string): Promise<Encuesta[]> {
    const apiUrl = API_URL + `/encuestas/`;
    //apiUrl = "https://mocki.io/v1/605b445a-03a2-4f50-b396-579224838780"
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching surveys: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Encuesta[];
  }

export async function load_survey_by_id(surveyId: string): Promise<Encuesta> {
    const apiUrl = API_URL + `/surveys/${surveyId}`;
    //apiUrl = 'https://mocki.io/v1/28e3c6aa-7b14-4798-a1b5-90ede6b6bf8c'

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching survey: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data as Encuesta;
  }

export async function upload_survey(newSurvey: Encuesta): Promise<Encuesta> {
  const apiUrl = API_URL + `/surveys-create/`;

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
  const apiUrl = API_URL + `/cuentas`;
  //console.log(apiUrl)
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Error fetching social accounts: ${response.statusText}`);
  }

  const data = await response.json();
  return data as SocialAccount[];
}

export async function add_social_account(social_account:SocialAccount): Promise<void> {
  const apiUrl = API_URL + `/cuentas/vincular/`;

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
  const apiUrl = API_URL + `/cuentas/desvincular/`;

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

export async function load_all_campaigns(): Promise<any[]> {
  const API_URL = "https://graph.facebook.com/v21.0/act_567132785808833/campaigns";
  const FIELDS = "fields=name,objective,status,start_time,stop_time";
  const EFFECTIVE_STATUS = 'effective_status=["ACTIVE","PAUSED"]';
  const TOKEN = "EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf"; // Reemplaza con tu token dinámico o guarda en .env

  try {
    const response = await fetch(`${API_URL}?${FIELDS}&${EFFECTIVE_STATUS}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching campaigns: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.data || []).map((campaign: Campaign) => ({
      id: campaign.id,
      name: campaign.name,
      objective: campaign.objective,
      status: campaign.status,
      budget: campaign.lifetime_budget || campaign.daily_budget || 0, // Usa lifetime_budget o daily_budget si están disponibles
      start_date: campaign.start_time,
      end_date: campaign.stop_time,
    }));
  } catch (error) {
    console.error("Error loading campaigns from Meta API:", error);
    return [];
  }
}

export async function load_ad_by_id(adId: string): Promise<Campaign> {
  const apiUrl = API_URL + `/campanas/${adId}`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Error fetching ad: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as Campaign;
}

export async function load_ad_by_campaign(adId: string): Promise<Campaign> {
  const apiUrl = 'https://mocki.io/v1/f5fb4d48-7ea6-46b6-8e42-0dcfa93f0013';
  //API_URL + `/campanas/${adId}`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Error fetching ad: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as Campaign;
}

export async function update_campaign_status(id: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
  const apiUrl = `https://graph.facebook.com/v21.0/${id}`;
  const token = "EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf"; // Asegúrate de reemplazar esto con tu token dinámico si es necesario.

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error actualizando el estado de la campaña:', error);
    throw new Error(`Failed to update campaign status: ${error.error_user_msg || response.statusText}`);
  }
}

export async function create_campaign(newCampaign: any) {
  const API_URL = 'https://graph.facebook.com/v21.0/act_567132785808833/campaigns';
  const token = 'EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf';

  const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCampaign),
  });

  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al crear la campaña');
  }

  return await response.json();
}

// Carga de Adsets
export async function load_adsets(campaignId: string): Promise<Adset[]> {
  
  const token = 'EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf';
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${campaignId}/adsets?fields=name,daily_budget,status&access_token=${token}`
  );
  if (!response.ok) {
    throw new Error('Error al cargar los Adsets');
  }
  const data = await response.json();
  return data.data as Adset[];
}

export async function update_adset_status(adsetId: string, status: string): Promise<void> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${adsetId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, access_token: 'EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf' }),
    }
  );
  if (!response.ok) {
    throw new Error('Error al actualizar el estado del AddSet');
  }
}

// Creación de Adsets
export async function create_adset(newAdset: any) {
  const API_URL = 'https://graph.facebook.com/v21.0/act_567132785808833/adsets';
  const token = 'EAAQswZB4FZCyUBOZBcP6RRZB6AxZB5F3ZC5V1OxmMaLdmDxFNaO3Gf6hOZB6PtqP9ZBjaS3DsWeY4tHLJ17Lacmc0lGN1J5HlqC8SblTUStw4GUrOEZCYO4RZAY6Hduoh8akz6kJSPYj8fdXt6M2POkMLs3DsAW5Luyzb4gLzZA7iZBsapXMHKdZAKZAX3XL99ewZBlBNSf';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAdset),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Error al crear el Adset');
  }

  return await response.json();
}