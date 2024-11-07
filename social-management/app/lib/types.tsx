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
  questions?: Question[];
  responses?: Response[];
}

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
  updatedTime: string; // Cambiado de timestamp a updatedTime para mostrar la fecha del último mensaje
  messageCount: number;
  type: 'message';
};

export type ChatMessage = {
  id: string;
  text: string;
  fromUser: boolean;
  userName?: string;
  formattedDate?: string; // Fecha formateada opcional
  timestamp?: Date; // Agrega timestamp opcionalmente como Date
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
