import{Routes} from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const PerformanceRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboarddetail",
    pathMatch: "full",
  },
 
  {
    path: "business",
    loadChildren: () => import("./appbusiness/perfomancebusiness.module").then(m => m.OrganizeBusinessModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];