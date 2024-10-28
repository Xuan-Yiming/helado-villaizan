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
  file: File;
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
  social_media: string; //fb,ig,tk
  type: string; //video,photos
  status: string; //publicado, programado, eliminado, borrador 
  preview?: string; //enlace
  media?: string; //enlace
  content?: string; //texto
  post_time?: string; 
  link?: string; //enlace al post
  is_programmed: boolean;
  programmed_post_time?: string;
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