import { Routes } from "@angular/router";

export const PayrollSettingRoutes: Routes = [
  {
    path: "payrollformula",
    //loadChildren: "./payrollformula/payrollformula.module#PayrollFormulaModule",
    loadChildren: () => import("./payrollformula/payrollformula.module").then(m => m.PayrollFormulaModule),
  },
  {
    path: "kpiformula",
    //loadChildren: "./kpiformula/kpiformula.module#KpiFormulaModule",
    loadChildren: () => import("./kpiformula/kpiformula.module").then(m => m.KpiFormulaModule),
  },
  {
    path: "kpiposition",
    //loadChildren: "./kpiposition/kpiposition.module#KpiPositionModule",
    loadChildren: () => import("./kpiposition/kpiposition.module").then(m => m.KpiPositionModule),
  },
  {
    path: "paycheck",
    //loadChildren: "./paycheck/paycheck.module#PaycheckModule",
    loadChildren: () => import("./paycheck/paycheck.module").then(m => m.PaycheckModule),
  },
];
