import { Routes } from "@angular/router";

export const PayrollBusinessRoutes: Routes = [
  {
    path: "calculatepayroll",
    //loadChildren: "./calculatepayroll/calculatepayroll.module#CalculatePayrollModule",
    loadChildren: () => import("./calculatepayroll/calculatepayroll.module").then(m => m.CalculatePayrollModule),
  },
  {
    path: "kpiemployee",
    //loadChildren: "./kpiemployee/kpiemployee.module#KpiEmployeeModule",
    loadChildren: () => import("./kpiemployee/kpiemployee.module").then(m => m.KpiEmployeeModule),
  },
  {
    path: "advance",
    //loadChildren: "./advance/advance.module#AdvanceModule",
    loadChildren: () => import("./advance/advance.module").then(m => m.AdvanceModule),
  },
  {
    path: "importpayroll",
    //loadChildren: "./importpayroll/importpayroll.module#ImportPayrollModule",
    loadChildren: () => import("./importpayroll/importpayroll.module").then(m => m.ImportPayrollModule),
  },
  {
    path: "importproduct",
    //loadChildren: "./importproduct/importproduct.module#ImportProductModule",
    loadChildren: () => import("./importproduct/importproduct.module").then(m => m.ImportProductModule),
  },
  {
    path: "importmachines",
    //loadChildren: "./importmachines/importmachines.module#ImportMachinesModule",
    loadChildren: () => import("./importmachines/importmachines.module").then(m => m.ImportMachinesModule),
  },
  {
    path: "taxincome",
    //loadChildren: "./importmachines/importmachines.module#ImportMachinesModule",
    loadChildren: () => import("./taxincome/taxincome.module").then(m => m.TaxIncomeModule),
  },
  {
    path: "importtaxincome",
    //loadChildren: "./importpayroll/importpayroll.module#ImportPayrollModule",
    loadChildren: () => import("./importtaxincome/importtaxincome.module").then(m => m.ImportTaxincomeModule),
  },
  {
  path: "dashboard",
  //loadChildren: "./importpayroll/importpayroll.module#ImportPayrollModule",
  loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule),
  }

];
