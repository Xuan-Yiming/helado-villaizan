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