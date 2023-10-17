import { Routes } from "@angular/router";


export const MediaBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "./survey/survey.module#SurveyModule",
    pathMatch: "full",
  },
  {
    path: "survey",
    //loadChildren: "./survey/survey.module#SurveyModule",
    loadChildren: () => import("./survey/survey.module").then(m => m.SurveyModule),
  },
  {
    path: "internalblog",
    //loadChildren: "./internalblog/internalblog.module#InternalBlogModule",
    loadChildren: () => import("./internalblog/internalblog.module").then(m => m.InternalBlogModule),
  },
  {
    path: "themeblog",
    //loadChildren: "./internalblog/internalblog.module#InternalBlogModule",
    loadChildren: () => import("./themeblog/themeblog.module").then(m => m.ThemeBlogModule),
  },
  
];
