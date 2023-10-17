import { Routes } from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const ReportRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/report/list/organization",
    pathMatch: "full",
  },
  {
    path: "business",
    //loadChildren: "./appbusiness/reportbusiness.module#ReportBusinessModule",
    loadChildren: () => import("./appbusiness/reportbusiness.module").then(m => m.ReportBusinessModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
