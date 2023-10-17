import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const OrganizeBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization-struct",
    pathMatch: "full",
  }
  ,
  {
    path: "organization-struct",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./organization-struct/organization-struct.module").then(m => m.OrganazitionStructModule),
  },
  // {
  //   path: "job",
  //   // loadChildren: "./contractinfor/contractinfor.module#ContractInforModule",
  // },
  {
    path: "job",
    //loadChildren: "./job/job.module#JobModule",
    loadChildren: () => import("./job/job.module").then(m => m.JobModule),
  },
  {
    path: "position",
    //loadChildren: "./position/position.module#PositionModule",
    loadChildren: () => import("./position/position.module").then(m => m.PositionModule),
  },
  {
    path: "plan",
    //loadChildren: "./plan/plan.module#PlanModule",
    loadChildren: () => import("./plan/plan.module").then(m => m.PlanModule),
  },
  {
    path: "organization",
    //loadChildren: "./organization/organization.module#OrganizationModule",
    loadChildren: () => import("./organization/organization.module").then(m => m.OrganizationModule),
  }
];
