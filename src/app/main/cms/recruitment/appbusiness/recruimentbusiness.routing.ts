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
    path: "dashboard",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
  },
  {
    path: "candidate",
    //loadChildren: "./staffprofile/staffprofile.module#StaffProfileModule",
    loadChildren: () => import("./candidate/candidate.module").then(m => m.CandidateModule),
    //canActivate: [TenantPermisstionGuard]
  },
  {
    path: "planreg",
    //loadChildren: "./staffprofile/staffprofile.module#StaffProfileModule",
    loadChildren: () => import("./planreg/planreg.module").then(m => m.PlanRegModule),
    //canActivate: [TenantPermisstionGuard]
  },
  {
    path: "rcrequest",
    //loadChildren: "./staffprofile/staffprofile.module#StaffProfileModule",
    loadChildren: () => import("./rcrequest/rcrequest.module").then(m => m.RcRequestModule),
    //canActivate: [TenantPermisstionGuard]
  },
];
