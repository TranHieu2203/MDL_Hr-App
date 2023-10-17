import { Routes } from "@angular/router";
import { Error404Component } from "../../main/errors/404/error-404.component";

export const CmsRoutes: Routes = [
  {
    path: "dashboard",
    //loadChildren: "./dashboard/dashboard.module#AppDashboardModule",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.AppDashboardModule),
  },
  {
    path: "profile",
    //loadChildren: "./profile/profile.module#ProfileModule",
    loadChildren: () => import("./profile/profile.module").then(m => m.ProfileModule),
  },
  {
    path: "payroll",
    //loadChildren: "./payroll/payroll.module#PayrollModule",
    loadChildren: () => import("./payroll/payroll.module").then(m => m.PayrollModule),
  },
  {
    path: "attendance",
    //loadChildren: "./attendance/attendance.module#AttendanceModule",
    loadChildren: () => import("./attendance/attendance.module").then(m => m.AttendanceModule),
  },
  {
    path: "report",
    //oadChildren: "./report/report.module#ReportModule",
    loadChildren: () => import("./report/report.module").then(m => m.ReportModule),
  },
  {
    path: "system",
    //loadChildren: "./system/system.module#SystemModule",
    loadChildren: () => import("./system/system.module").then(m => m.SystemModule),
  },
  {
    path: "media",
    //loadChildren: "./media/media.module#MediaModule",
    loadChildren: () => import("./media/media.module").then(m => m.MediaModule),
  },
  {
    path: "administration",
    //loadChildren: "./administration/administration.module#AdministrationModule",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.AppDashboardModule),
  },
  {
    path: "others",
    //loadChildren: "./others/others.module#OthersModule",
    loadChildren: () => import("./others/others.module").then(m => m.OthersModule),
  },
  {
    path: "organize",
    //loadChildren: "./organize/organize.module#OrganizeModule",
    loadChildren: () => import("./organize/organize.module").then(m => m.OrganizeModule),
  },
  {
    path: "recruitment",
    //loadChildren: "./organize/organize.module#OrganizeModule",
    loadChildren: () => import("./recruitment/recruitment.module").then(m => m.RecruitmentModule),
  },
  {
    path: "perfomance",
    //loadChildren: "./organize/organize.module#OrganizeModule",
    loadChildren: () => import("./perfomance/perfomance.module").then(m => m.PerformanceModule),
  },
  {
    path: "capacity",
    //loadChildren: "./organize/organize.module#OrganizeModule",
    loadChildren: () => import("./capacity/capacity.module").then(m => m.CapacityModule),
  },
  // {
  //   path: "autoforms-center",
  //   loadChildren: () => import('./autoforms/autoforms.module').then(m => m.AutoformsModule)
  // },
  {
    path: "**",
    component: Error404Component,
  },
];
