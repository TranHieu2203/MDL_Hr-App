import { Routes } from "@angular/router";

export const ListSysRoutes: Routes = [
  {
    path: "otherlist",
    //loadChildren:      "./applist/otherlist.module#OtherListModule",
    loadChildren: () => import("./applist/otherlist.module").then(m => m.OtherListModule)
  },
  {
    path: "bank",
    //loadChildren:       "./bank/bank.module#BankModule",
    loadChildren: () => import("./bank/bank.module").then(m => m.BankModule)
  }
];
