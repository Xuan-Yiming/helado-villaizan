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