import{Routes} from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const OrganizeRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboarddetail",
    pathMatch: "full",
  },
  {
    path: "list",
    //loadChildren: "./applist/organizelist.module#OrganizeListModule",
    loadChildren: () => import("./applist/organizelist.module").then(m => m.OrganizeListModule),
  },
  {
    path: "business",
    //loadChildren: "./appbusiness/organizebusiness.module#OrganizeBusinessModule",
    loadChildren: () => import("./appbusiness/organizebusiness.module").then(m => m.OrganizeBusinessModule),
  },
  {
    path: "report",
    //loadChildren: "./appreport/organizereport.module#OrganizeReportModule",
    loadChildren: () => import("./appreport/organizereport.module").then(m => m.OrganizeReportModule),
  },
  {
    path: "dashboarddetail",
    //loadChildren: "./appdashboarddetail/organizedashboarddetail.module#OrganizeDashboardDetailModule",
    loadChildren: () => import("./appdashboarddetail/organizedashboarddetail.module").then(m => m.OrganizeDashboardDetailModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];