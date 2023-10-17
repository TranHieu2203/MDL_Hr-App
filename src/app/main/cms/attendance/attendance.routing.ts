import { Routes } from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const AttendanceRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization",
    pathMatch: "full",
  },
  {
    path: "list",
    //loadChildren: "./applist/attendancelist.module#AttendanceListModule",
    loadChildren: () => import("./applist/attendancelist.module").then(m => m.AttendanceListModule),
  },
  {
    path: "setting",
    //loadChildren: "./appsystem/appsystem.module#AttendanceSystemModule",
    loadChildren: () => import("./appsystem/appsystem.module").then(m => m.AttendanceSystemModule),
  },
  {
    path: "business",
    //loadChildren: "./appbusiness/appbusiness.module#AttendanceBusinessModule",
    loadChildren: () => import("./appbusiness/appbusiness.module").then(m => m.AttendanceBusinessModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
