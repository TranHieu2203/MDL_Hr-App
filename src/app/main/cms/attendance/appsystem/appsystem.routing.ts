import { Routes } from "@angular/router";

export const AttendanceSystemRoutes: Routes = [
  {
    path: "shiftcycle",
    //loadChildren: "./shiftcycle/shiftcycle.module#ShiftCycleModule",
    loadChildren: () => import("./shiftcycle/shiftcycle.module").then(m => m.ShiftCycleModule),
  },
  {
    path: "timesheetformula",
    //loadChildren: "./timesheetformula/timesheetformula.module#TimeSheetFormulaModule",
    loadChildren: () => import("./timesheetformula/timesheetformula.module").then(m => m.TimeSheetFormulaModule),
  },
  //{
  //  path: "overtimeconfig",
  //  loadChildren:
  //    "./overtimeconfig/overtimeconfig.module#OverTimeConfigModule",
  //},
];
