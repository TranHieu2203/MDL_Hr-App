import { Routes } from "@angular/router";

export const OrganizeDashboardDetailRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboardposition",
    pathMatch: "full",
  },
  {
    path: "dashboardposition",
    //loadChildren: "./dashboardposition/dashboardposition.module#DashboardPositionModule",
    loadChildren: () => import("./dashboardposition/dashboardposition.module").then(m => m.DashboardPositionModule),
  }
];
