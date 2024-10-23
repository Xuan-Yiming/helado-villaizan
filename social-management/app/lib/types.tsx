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
  social_media: string;
  type: string;
  status: string;
  preview?: string;
  media?: string;
  content?: string;
  post_time?: Date;
  link?: string;
  is_programmed: boolean;
  programmed_post_time?: Date;
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
  answers: Answer[];
}

export type Answer = {
  question_id: string;
  answer: string;
}