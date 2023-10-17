import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const OrganizeReportRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/report/report",
    pathMatch: "full",
  },
  {
    path: "reports",
    //loadChildren: "./reports/reports.module#ReportsModule",
    loadChildren: () => import("./reports/reports.module").then(m => m.ReportsModule),
  }
];
