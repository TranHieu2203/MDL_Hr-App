import { Routes } from "@angular/router";

export const ProfileSettingRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/profile/setting/orgchart",
    pathMatch: "full",
  },
  // {
  //   path: "organization",
  //   //loadChildren: "./organization/organization.module#OrganizationModule",
  // },
  {
    path: "orgchart",
    //loadChildren: "./orgchart/orgchart.module#OrgChartModule",
    loadChildren: () => import("./orgchart/orgchart.module").then(m => m.OrgChartModule),
  },
  {
    path: "pospaper",
    //loadChildren: "./pospaper/pospaper.module#PosPaperModule",
    loadChildren: () => import("./pospaper/pospaper.module").then(m => m.PosPaperModule),
  },
  {
    path: "decisioncreate",
    //loadChildren: "./decisioncreate/decisioncreate.module#DecisionCreateModule",
    loadChildren: () => import("./decisioncreate/decisioncreate.module").then(m => m.DecisionCreateModule),
  },
  {
    path: "remind",
    //loadChildren: "./decisioncreate/decisioncreate.module#DecisionCreateModule",
    loadChildren: () => import("./remind/remind.module").then(m => m.RemindModule),
  },
];
