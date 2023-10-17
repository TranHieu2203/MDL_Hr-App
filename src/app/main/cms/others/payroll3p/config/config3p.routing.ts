import { Routes } from "@angular/router";
import { Error404Component } from "../../../../../main/errors/404/error-404.component";

export const Config3PRoutes: Routes = [
  {
    path: "jobevaluetionconfig",
    //loadChildren: "./jobevaluetionconfig/jobevaluetionconfig.module#JobEvaluetionConfigModule",
    loadChildren: () => import("./jobevaluetionconfig/jobevaluetionconfig.module").then(m => m.JobEvaluetionConfigModule),
  },
  {
    path: "personcompetence",
    //loadChildren: "./personcompetence/personcompetence.module#PersonCompetenceModule",
    loadChildren: () => import("./personcompetence/personcompetence.module").then(m => m.PersonCompetenceModule),
  },
  {
    path: "unitprice",
    //loadChildren: "./unitprice/unitprice.module#UnitPriceModule",
    loadChildren: () => import("./unitprice/unitprice.module").then(m => m.UnitPriceModule),
  },
  {
    path: "ranksystem",
    //loadChildren: "./ranksystem/ranksystem.module#RankSystemModule",
    loadChildren: () => import("./ranksystem/ranksystem.module").then(m => m.RankSystemModule),
  },
  {
    path: "groupposition3p",
    //loadChildren: "./groupposition3p/groupposition3p.module#GroupPosition3PModule",
    loadChildren: () => import("./groupposition3p/groupposition3p.module").then(m => m.GroupPosition3PModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
