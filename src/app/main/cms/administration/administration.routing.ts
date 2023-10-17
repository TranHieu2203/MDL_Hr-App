import { Routes } from "@angular/router";

export const AdministrationRoutes: Routes = [
  {
    path: "",
    redirectTo: "./groupposition/groupposition.module#GroupPositionModule",
    pathMatch: "full",
  },
  {
    path: "list",
    //loadChildren: "./list/adminlist.module#AdminListModule",
    loadChildren: () => import("./list/adminlist.module").then(m => m.AdminListModule),
  },
   {
    path: "business",
    //loadChildren: "./business/adminbusiness.module#AdminBusinessModule",
    loadChildren: () => import("./business/adminbusiness.module").then(m => m.AdminBusinessModule),
  },
];
