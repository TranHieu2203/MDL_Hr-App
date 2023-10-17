import { Routes } from "@angular/router";

export const AttendanceListRoutes: Routes = [
  {
    path: "symbol",
    //loadChildren: "./symbol/symbol.module#SymbolModule",
    loadChildren: () => import("./symbol/symbol.module").then(m => m.SymbolModule),
  },
  {
    path: "timetype",
    //loadChildren: "./timetype/timetype.module#TimeTypeModule",
    loadChildren: () => import("./timetype/timetype.module").then(m => m.TimeTypeModule),
  },
  {
    path: "shift",
    //loadChildren: "./shift/shift.module#ShiftModule",
    loadChildren: () => import("./shift/shift.module").then(m => m.ShiftModule),
  },
  {
    path: "holiday",
    //loadChildren: "./holiday/holiday.module#HolidayModule",
    loadChildren: () => import("./holiday/holiday.module").then(m => m.HolidayModule),
  }, 
  {
    path: "salaryperiod",
    //loadChildren: "./salaryperiod/salaryperiod.module#SalaryPeriodModule",
    loadChildren: () => import("./salaryperiod/salaryperiod.module").then(m => m.SalaryPeriodModule),
  }, 
  {
    path: "terminals",
    //loadChildren: "./salaryperiod/salaryperiod.module#SalaryPeriodModule",
    loadChildren: () => import("./terminals/terminals.module").then(m => m.TerminalsModule),
  },
  {
    path: "otherlist",
    loadChildren: () => import("./otherlist/otherlist.module").then(m => m.OtherlistModule),
  },
];
