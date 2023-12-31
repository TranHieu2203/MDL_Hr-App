export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "group" | "collapsable" | "module";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
    title?: string;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children: NavigationItem[];
  root?: boolean;
}

export interface Navigation extends NavigationItem {
  children: NavigationItem[];
}
