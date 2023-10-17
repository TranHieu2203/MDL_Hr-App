import{Routes} from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const CapacityRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboarddetail",
    pathMatch: "full",
  },
 
  {
    path: "business",
    loadChildren: () => import("./appbusiness/capacitybusiness.module").then(m => m.CapacityBusinessModule),
  },
  {
    path: "list",
    loadChildren: () => import("./applist/capacitylist.module").then(m => m.CapacityListModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];