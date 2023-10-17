import { Routes } from "@angular/router";
import { Error404Component } from "../../../../main/errors/404/error-404.component";

export const Payroll3PRoutes: Routes = [
  {
    path: "payroll3plist",
    //loadChildren: "./payroll3plist/payroll3plist.module#Payroll3PListModule",
    loadChildren: () => import("./payroll3plist/payroll3plist.module").then(m => m.Payroll3PListModule),
  },
  {
    path: "config3p",
    //loadChildren: "./config/config3p.module#Config3PModule",
    loadChildren: () => import("./config/config3p.module").then(m => m.Config3PModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
