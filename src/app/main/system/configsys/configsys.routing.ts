import { Routes } from "@angular/router";

export const SysConfigRoutes: Routes = [
  {
    path: "symbolsys",
    //loadChildren:      "./symbolsys/symbolsys.module#SymbolSysModule",
    loadChildren: () => import("./symbolsys/symbolsys.module").then(m => m.SymbolSysModule)
  },
  {
    path: "timetype",
    //loadChildren:      "./timetypesys/timetypesys.module#TimeTypeSysModule",
    loadChildren: () => import("./timetypesys/timetypesys.module").then(m => m.TimeTypeSysModule)
  },
  {
    path: "grouppositionsys",
    //loadChildren:      "./grouppositionsys/grouppositionsys.module#GroupPositionSysModule",
    loadChildren: () => import("./grouppositionsys/grouppositionsys.module").then(m => m.GroupPositionSysModule)
  },
  {
    path: "positionsys",
    //loadChildren:      "./positionsys/positionsys.module#PositionSysModule",
    loadChildren: () => import("./positionsys/positionsys.module").then(m => m.PositionSysModule)
  },
  {
    path: "contracttypesys",
    //loadChildren:      "./contracttypesys/contracttypesys.module#ContractTypeSysModule",
    loadChildren: () => import("./contracttypesys/contracttypesys.module").then(m => m.ContractTypeSysModule)
  },
   {
    path: "shiftsys",
    //loadChildren:      "./shiftsys/shiftsys.module#ShiftSysModule",
    loadChildren: () => import("./shiftsys/shiftsys.module").then(m => m.ShiftSysModule)
  },
  {
    path: "salarytypesys",
    //loadChildren:      "./salarytypesys/salarytypesys.module#SalaryTypeSysModule",
    loadChildren: () => import("./salarytypesys/salarytypesys.module").then(m => m.SalaryTypeSysModule)
  },
  {
    path: "salaryelementsys",
    //loadChildren:      "./salaryelementsys/salaryelementsys.module#SalaryElementSysModule",
    loadChildren: () => import("./salaryelementsys/salaryelementsys.module").then(m => m.SalaryElementSysModule)
  },
  {
    path: "salarystructuresys",
    //loadChildren:      "./salarystructuresys/salarystructuresys.module#SalaryStructureSysModule",
    loadChildren: () => import("./salarystructuresys/salarystructuresys.module").then(m => m.SalaryStructureSysModule)
  },
  {
    path: "payrollformulasys",
    //loadChildren:      "./payrollformulasys/payrollformulasys.module#PayrollFormulaSysModule",
    loadChildren: () => import("./payrollformulasys/payrollformulasys.module").then(m => m.PayrollFormulaSysModule)
  },
  {
    path: "settingreportsys",
    //loadChildren:      "./settingreportsys/settingreportsys.module#SettingReportSysModule",
    loadChildren: () => import("./settingreportsys/settingreportsys.module").then(m => m.SettingReportSysModule)
  }
];
