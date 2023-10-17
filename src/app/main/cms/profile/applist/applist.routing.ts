import { Routes } from "@angular/router";

export const ProfileListRoutes: Routes = [
  {
    path: "",
    redirectTo: "./groupposition/groupposition.module#GroupPositionModule",
    pathMatch: "full",
  },
  {
    path: "groupposition",
    //loadChildren: "./groupposition/groupposition.module#GroupPositionModule",
    loadChildren: () => import("./groupposition/groupposition.module").then(m => m.GroupPositionModule),
  },
  // {
  //   path: "position",
  //   //loadChildren: "./position/position.module#PositionModule",
  // },
  {
    path: "contracttype",
    //loadChildren: "./contracttype/contracttype.module#ContractTypeModule",
    loadChildren: () => import("./contracttype/contracttype.module").then(m => m.ContractTypeModule),
  },
  {
    path: "welfare",
    //loadChildren: "./welfare/welfare.module#WelfareModule",
    loadChildren: () => import("./welfare/welfare.module").then(m => m.WelfareModule),
  },
  {
    path: "allowance",
    //loadChildren: "./allowance/allowance.module#AllowanceModule",
    loadChildren: () => import("./allowance/allowance.module").then(m => m.AllowanceModule),
  },
  {
    path: "allowanseemployee",
    //loadChildren:      "./allowanceemployee/allowanceemployee.module#AllowanceEmployeeModule",
    loadChildren: () => import("./allowanceemployee/allowanceemployee.module").then(m => m.AllowanceEmployeeModule),
  },
  {
    path: "salaryscale",
    //loadChildren: "./salaryscale/salaryscale.module#SalaryScaleModule",
    loadChildren: () => import("./salaryscale/salaryscale.module").then(m => m.SalaryScaleModule),
  },
  {
    path: "salaryrank",
    //loadChildren: "./salaryrank/salaryrank.module#SalaryRankModule",
    loadChildren: () => import("./salaryrank/salaryrank.module").then(m => m.SalaryRankModule),
  },
  {
    path: "salarylevel",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./salarylevel/salarylevel.module").then(m => m.SalaryLevelModule),
  },
  {
    path: "salarytype",
    //loadChildren: "./salarytype/salarytype.module#SalaryTypeModule",
    loadChildren: () => import("./salarytype/salarytype.module").then(m => m.SalaryTypeModule),
  },
  {
    path: "salarysample",
    //loadChildren: "./salarysample/salarysample.module#SalarySampleModule",
    loadChildren: () => import("./salarysample/salarysample.module").then(m => m.SalarySampleModule),
  },
  {
    path: "otherlist",
    //loadChildren: "./otherlist/otherlist.module#OtherlistModule",
    loadChildren: () => import("./otherlist/otherlist.module").then(m => m.OtherlistModule),
  },
  {
    path: "insspecified",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./insspecified/insspecified.module").then(m => m.InsSpecifiedModule),
  },
  {
    path: "insregimetype",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./insregimetype/insregimetype.module").then(m => m.InsRegimeTypeModule),
  },
  {
    path: "reportconfig",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./reportconfig/reportconfig.module").then(m => m.ReportConfigModule),
  },
  {
    path: "bank",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./bank/bank.module").then(m => m.BankModule),
  },
  {
    path: "bankbranch",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./bankbranch/bankbranch.module").then(m => m.BankBranchModule),
  },
  
  

];
