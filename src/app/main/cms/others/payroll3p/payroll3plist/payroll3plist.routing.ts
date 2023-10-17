import { Routes } from "@angular/router";
import { Error404Component } from "../../../../../main/errors/404/error-404.component";

export const Payroll3PListRoutes: Routes = [
  {
    path: "competence",
    //loadChildren: "./competence/competence.module#CompetenceModule",
    loadChildren: () => import("./competence/competence.module").then(m => m.CompetenceModule),
  },
  {
    path: "leveldetails",
    //loadChildren: "./leveldetails/leveldetails.module#LevelDetailsModule",
    loadChildren: () => import("./leveldetails/leveldetails.module").then(m => m.LevelDetailsModule),
  },
  {
    path: "jobevaluetion",
    //loadChildren: "./jobevaluetion/jobevaluetion.module#JobEvaluetionModule",
    loadChildren: () => import("./jobevaluetion/jobevaluetion.module").then(m => m.JobEvaluetionModule),
  },
  {
    path: "exchangelist",
    //loadChildren: "./exchangelist/exchangelist.module#ExchangeListModule",
    loadChildren: () => import("./exchangelist/exchangelist.module").then(m => m.ExchangeListModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];
