import{Routes} from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const MediaRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboarddetail",
    pathMatch: "full",
  },
  
  {
    path: "business",
    //loadChildren: "./appbusiness/organizebusiness.module#OrganizeBusinessModule",
    loadChildren: () => import("./appbusiness/mediabusiness.module").then(m => m.MediaBusinessModule),
  },
  
  {
    path: "**",
    component: Error404Component,
  },
];