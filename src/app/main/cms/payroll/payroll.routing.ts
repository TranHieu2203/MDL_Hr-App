import { Routes } from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const PayrollRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization",
    pathMatch: "full",
  },
  {
    path: "list",
    //loadChildren: "./applist/payrolllist.module#PayrollListModule",
    loadChildren: () => import("./applist/payrolllist.module").then(m => m.PayrollListModule),
  },
  {
    path: "setting",
    //loadChildren: "./appsystem/payrollsetting.module#PayrollSettingModule",
    loadChildren: () => import("./appsystem/payrollsetting.module").then(m => m.PayrollSettingModule),
  },
  {
    path: "business",
    //loadChildren: "./appbusiness/payrollbusiness.module#PayrollBusinessModule",
    loadChildren: () => import("./appbusiness/payrollbusiness.module").then(m => m.PayrollBusinessModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
