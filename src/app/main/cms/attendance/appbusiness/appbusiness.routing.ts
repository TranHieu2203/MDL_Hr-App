import { Routes } from "@angular/router";

export const AttendanceBusinessRoutes: Routes = [
  {
    path: "timesheet",
    //loadChildren: "./timesheet/timesheet.module#TimeSheetModule",
    loadChildren: () => import("./timesheet/timesheet.module").then(m => m.TimeSheetModule),
  },
  {
    path: "shiftsort",
    //loadChildren: "./shiftsort/shiftsort.module#ShiftSortModule",
    loadChildren: () => import("./shiftsort/shiftsort.module").then(m => m.ShiftSortModule),
  },
  {
    path: "dutyscheduled",
    //loadChildren: "./dutyscheduled/dutyscheduled.module#DutyScheduledModule",
    loadChildren: () => import("./dutyscheduled/dutyscheduled.module").then(m => m.DutyScheduledModule),
  },
  {
    path: "timelateearly",
    //loadChildren: "./timelateearly/timelateearly.module#TimeLateEarlyModule",
    loadChildren: () => import("./timelateearly/timelateearly.module").then(m => m.TimeLateEarlyModule),
  },
  {
    path: "registeroff",
    //loadChildren: "./registeroff/registeroff.module#RegisterOffModule",
    loadChildren: () => import("./registeroff/registeroff.module").then(m => m.RegisterOffModule),
  },
  {
    path: "overtime",
    //loadChildren: "./overtime/overtime.module#OvertimeModule",
    loadChildren: () => import("./overtime/overtime.module").then(m => m.OvertimeModule),
  },
  {
    path: "takeleave",
    //loadChildren: "./takeleave/takeleave.module#TakeLeaveModule",
    loadChildren: () => import("./takeleave/takeleave.module").then(m => m.TakeLeaveModule),
  },
  {
    path: "declareleave",
    //loadChildren: "./declareleave/declareleave.module#DeclareleaveModule",
    loadChildren: () => import("./declareleave/declareleave.module").then(m => m.DeclareleaveModule),
  },
  {
    path: "swipedata",
    //loadChildren: "./declareleave/declareleave.module#DeclareleaveModule",
    loadChildren: () => import("./swipedata/swipedata.module").then(m => m.SwipeDataModule),
  },
];
