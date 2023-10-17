import { Routes } from "@angular/router";

export const PayrollListRoutes: Routes = [
  {
    path: "salaryelement",
    //loadChildren: "./salaryelement/salaryelement.module#SalaryElementModule",
    loadChildren: () => import("./salaryelement/salaryelement.module").then(m => m.SalaryElementModule),
  },
  {
    path: "salarystructure",
    //loadChildren: "./salarystructure/salarystructure.module#SalaryStructureModule",
    loadChildren: () => import("./salarystructure/salarystructure.module").then(m => m.SalaryStructureModule),
  },
  {
    path: "kpigroup",
    //loadChildren: "./kpigroup/kpigroup.module#KpiGroupModule",
    loadChildren: () => import("./kpigroup/kpigroup.module").then(m => m.KpiGroupModule),
  },
  {
    path: "kpitarget",
    //loadChildren:       "./kpitarget/kpitarget.module#KpiTargetModule",
    loadChildren: () => import("./kpitarget/kpitarget.module").then(m => m.KpiTargetModule),
  }, 
  {
    path: "listmachine",
    //loadChildren: "./listmachine/listmachine.module#ListmachineModule",
    loadChildren: () => import("./listmachine/listmachine.module").then(m => m.ListmachineModule),
  },
  {
    path: "listproduct",
    //loadChildren: "./listproduct/listproduct.module#ListProductModule",
    loadChildren: () => import("./listproduct/listproduct.module").then(m => m.ListProductModule),
  },    
];
