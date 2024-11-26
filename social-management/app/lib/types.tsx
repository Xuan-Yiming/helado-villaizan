export type UserAccount = {
  id: string;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  role: string; // admin, user, moderator, survy_creator
  token?: string;
  token_expiration_date?: Date;
  active: boolean;
  photo?:string;
}


export type SocialAccount = {
  id?: number;
  red_social: string;
  usuario?: string;

  tipo_autenticacion: string;

  page_id?: string;
  open_id?: string;
  refresh_token?: string;
  token_autenticacion: string;
  instagram_business_account?: string;

  fecha_expiracion_token?: string;
  fecha_expiracion_refresh?: string;
  linked?: boolean
}

export type MediaFILE = {
  id: string;
  file: File | null;
  url: string;
  type: string;
  name: string;
}

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Post = {
  id: string;
  social_media: string[]; //fb,ig,tk
  type: string; //video,photos
  status: string; //publicado, programado, borrador 
  thumbnail?: string; //enlace
  media?: string[]; //enlace
  content?: string; //texto
  post_time?: string; 
}

export type calendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  url?: string;
  date?: string;
  allDay?: boolean;
  overlap: boolean;
}

export type Encuesta = {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_date: string;
  end_date: string;
  creator_id: string; // Nuevo campo
  questions?: Question[];
  responses?: Response[];
};

export type Question = {
  id: string;
  title: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export type Response = {
  id: string;
  date: string;
  ip?: string;
  answers: Answer[];
}

export type Answer = {
  question_id: string;
  answer: string;
}

/* INTERACCIONES */

export type InteractionPublication = {
  postId: string;
  socialNetwork: 'facebook' | 'instagram';
  caption: string;
  commentsCount: number;
  thumbnail?: string;
  publishDate?: string;
  mediaType?: 'image' | 'video';
  comments: MetaComment[];
  type: 'publication';
};

export type InteractionMessage = {
  id: number;
  userName: string;
  socialNetwork: 'facebook' | 'instagram';
  lastMessage: string;
  updatedTime: string; // Fecha del último mensaje
  messageCount: number;
  unreadCount?: number; // Agrega este campo como opcional
  userId: string; // ID único del usuario para mensajes directos
  type: 'message';
};


// Define un tipo para los adjuntos del mensaje
type MessageAttachment = {
  type: 'image' | 'audio' | 'sticker' | 'video';
  url: string;
};

// Actualiza ChatMessage para incluir los adjuntos
export type ChatMessage = {
  id: string;
  text: string;
  fromUser: boolean;
  userName?: string;
  formattedDate?: string;
  timestamp?: Date;
  attachment?: MessageAttachment | null; // Añade la propiedad de attachment opcional
};



// Para API de Meta (Facebook e Instagram)
export type MetaApiResponse<T> = {
  data: T;
  paging?: {
    previous?: string;
    next?: string;
  };
};

export type MetaDM = {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: string;
};

export type MetaComment = {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
};

export type MetaPost = {
  id: string;
  socialNetwork: 'facebook' | 'instagram';
  caption: string;
  comments: MetaComment[];
  mediaType: 'image' | 'video';
  thumbnail?: string;
  publishDate: string; // Cambiado de postDate a publishDate para coherencia
};

export type Ad = {
  id: string;
  name: string; // Nombre del conjunto de anuncios
  campaign_id: string | number; // ID de la campaña a la que se asociará el conjunto de anuncios
  daily_budget?: number; // Presupuesto diario en la moneda de la cuenta
  lifetime_budget?: number; // Presupuesto total en la moneda de la cuenta
  billing_event: 'APP_INSTALLS' | 'IMPRESSIONS' | 'LINK_CLICKS' | 'OFFER_CLAIMS' | 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 'VIDEO_VIEWS' | 'THRUPLAY' | 'PURCHASE' | 'LISTING_INTERACTION'; // Evento de facturación utilizado para el conjunto de anuncios
  optimization_goal: 'NONE' | 'APP_INSTALLS' | 'AD_RECALL_LIFT' | 'ENGAGED_USERS' | 'EVENT_RESPONSES' | 'IMPRESSIONS' | 'LEAD_GENERATION' | 'LINK_CLICKS' | 'OFFSITE_CONVERSIONS' | 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 'REACH' | 'LANDING_PAGE_VIEWS' | 'VALUE' | 'THRUPLAY' | 'VISIT_INSTAGRAM_PROFILE'; // Lo que se optimiza en el conjunto de anuncios
  status: 'ACTIVE' | 'PAUSED'; // Estado del conjunto de anuncios al momento de la creación
  targeting: {
    countries: string[]; // Debe incluir al menos countries
    [key: string]: any; // Otros campos de segmentación
  };
  start_time?: string; // Fecha de inicio del conjunto de anuncios
  end_time?: string; // Fecha de fin del conjunto de anuncios
  daily_spend_cap?: number; // Límite de gasto diario
  lifetime_spend_cap?: number; // Límite de gasto total
};

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  lifetime_budget?: number;
  daily_budget?: number;
  start_time: Date;
  stop_time: Date;
  // Agrega más propiedades según sea necesario
}

export interface Adset {
  id: string;
  name: string;
  daily_budget: string;
  status: string;
  // Agrega más propiedades según sea necesario
}