import { Routes } from "@angular/router";

export const OrganizeListRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/organize/list/job-band",
    pathMatch: "full",
  },
  {
    path: "job-band",
    //loadChildren: "./job-band/job-band.module#JobBandModule",
    loadChildren: () => import("./job-band/job-band.module").then(m => m.JobBandModule),
  },
  {
    path: "companyinfo",
    //loadChildren: "./companyinfo/companyinfo.module#CompanyInfoModule",
    loadChildren: () => import("./companyinfo/companyinfo.module").then(m => m.CompanyInfoModule),
  },
  {
    path: "",
    redirectTo: "/hrms/organize/list/companyinfo",
    pathMatch: "full",
  },
  {
    path: "title",
    //loadChildren: "./companyinfo/companyinfo.module#CompanyInfoModule",
    loadChildren: () => import("./title/title.module").then(m => m.TitleModule),
  },
  {
    path: "positionorg",
    //loadChildren: "./companyinfo/companyinfo.module#CompanyInfoModule",
    loadChildren: () => import("./positionorg/positionorg.module").then(m => m.PositionOrgModule),
  },
];
