import { Routes } from "@angular/router";

export const ReportBusinessRoutes: Routes = [
  {
    path: "businessreport",
    //loadChildren: "./businessreport/businessreport.module#BusinessReportModule",
    loadChildren: () => import("./businessreport/businessreport.module").then(m => m.BusinessReportModule),
  },
  {
    path: "reportchart",
    //loadChildren: "./reportchart/reportchart.module#ReportChartModule",
    loadChildren: () => import("./reportchart/reportchart.module").then(m => m.ReportChartModule),
  },
];
