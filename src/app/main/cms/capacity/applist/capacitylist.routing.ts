import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const CapacityListRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/business/organization-struct",
    pathMatch: "full",
  }
  ,
  {
    path: "competencyperiod",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./competencyperiod/competencyperiod.module").then(m => m.CompetencyPeriodModule),
  },
  {
    path: "competencyframe",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./competencyframe/competencyframe.module").then(m => m.CompetencyFrameModule),
  },
  {
    path: "competencylevel",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./competencylevel/competencylevel.module").then(m => m.CompetencyLevelModule),
  },
  {
    path: "compesetposition",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./compesetposition/compesetposition.module").then(m => m.CompeSetPositionModule),
  },
  {
    path: "competencyperiodcp",
    //loadChildren: "./organization-struct/organization-struct.module#OrganazitionStructModule",
    loadChildren: () => import("./competencyperiodcp/competencyperiodcp.module").then(m => m.CompetencyPeriodCpModule),
  },
  
];
