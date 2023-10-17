import { Routes } from "@angular/router";
import { Error404Component } from "../../../main/errors/404/error-404.component";

export const OthersRoutes: Routes = [
  {
    path: "payroll3p",
    //loadChildren: "./payroll3p/payroll3p.module#Payroll3PModule",
    loadChildren: () => import("./payroll3p/payroll3p.module").then(m => m.Payroll3PModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
