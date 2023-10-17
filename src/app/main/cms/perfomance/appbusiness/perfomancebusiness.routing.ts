import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const PerfomanceBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization-struct",
    pathMatch: "full",
  }
  ,
  {
    path: "dashboard",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
  },
  
];
