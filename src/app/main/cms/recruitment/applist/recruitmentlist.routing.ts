import { Routes } from "@angular/router";

export const RecruitmentListRoutes: Routes = [
  
  {
    path: "otherlist",
    loadChildren: () => import("./otherlist/otherlist.module").then(m => m.OtherlistModule),
  },
];
