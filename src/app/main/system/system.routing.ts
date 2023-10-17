import { Routes } from "@angular/router";

export const SystemRoutes: Routes = [
  {
    path: "sdashboard",
    //loadChildren: "./sdashboard/sdashboard.module#SystemDashboardModule",
    loadChildren: () => import("./sdashboard/sdashboard.module").then(m => m.SystemDashboardModule),
  },
  {
    path: "config",
    //loadChildren: "./config/config.module#SystemConfigModule",
    loadChildren: () => import("./config/config.module").then(m => m.SystemConfigModule),
  },
  {
    path: "website",
    //loadChildren: "./website/website.module#WebsiteModule",
    loadChildren: () => import("./website/website.module").then(m => m.WebsiteModule),
  },
  {
    path: "configsys",
    //loadChildren: "./configsys/configsys.module#SysConfigModule",
    loadChildren: () => import("./configsys/configsys.module").then(m => m.SysConfigModule),
  },
  {
    path: "listsys",
    //loadChildren: "./list/listsys.module#ListSysModule",
    loadChildren: () => import("./list/listsys.module").then(m => m.ListSysModule),
  },
  {
    path: "",
    redirectTo: "/sys/config/account",
    pathMatch: "full",
  },
];
