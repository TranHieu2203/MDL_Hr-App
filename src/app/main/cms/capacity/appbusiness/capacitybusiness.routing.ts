import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const CapacityBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization-struct",
    pathMatch: "full",
  }
  ,
  {
    path: "competencylevellist",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./competencylevellist/competencylevellist.module").then(m => m.CompetencyLevelListModule),
  },
  {
    path: "competencysum",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./competencysum/competencysum.module").then(m => m.CompetencySumModule),
  },
  {
    path: "checkpointsum",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./checkpointsum/checkpointsum.module").then(m => m.CheckpointSumModule),
  },
  {
    path: "processlist",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./processlist/processlist.module").then(m => m.ProcessListModule),
  },
];
