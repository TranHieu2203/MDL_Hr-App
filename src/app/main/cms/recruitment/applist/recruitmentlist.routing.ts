import { Routes } from "@angular/router";

export const RecruitmentListRoutes: Routes = [
  
  {
    path: "otherlist",
    loadChildren: () => import("./otherlist/otherlist.module").then(m => m.OtherlistModule),
  },
  {
    path: "criteria",
    loadChildren: () => import("./criteria/criteria.module").then(m => m.CriteriaModule),
  },
  {
    path: "groupcriteria",
    loadChildren: () => import("./groupcriteria/groupcriteria.module").then(m => m.GroupCriteriaModule),
  },
  {
    path: "evaluation",
    loadChildren: () => import("./evaluation/evaluation.module").then(m => m.EvaluationModule),
  },
];
