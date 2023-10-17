import { Routes } from "@angular/router";

export const SystemRoutes: Routes = [
  {
    path: "groupfunction",
    //loadChildren: "./groupfunction/groupfunction.module#GroupFunctionModule",
    loadChildren: () => import("./groupfunction/groupfunction.module").then(m => m.GroupFunctionModule),
  },
  {
    path: "function",
    //loadChildren: "./function/function.module#FunctionModule",
    loadChildren: () => import("./function/function.module").then(m => m.FunctionModule),
  },
  {
    path: "functionmenu",
    //loadChildren: "./function/function.module#FunctionModule",
    loadChildren: () => import("./functionmenu/functionmenu.module").then(m => m.FunctionMenuModule),
  },
  {
    path: "templatedecision",
    //loadChildren: "./function/function.module#FunctionModule",
    loadChildren: () => import("./templatedecision/templatedecision.module").then(m => m.TemplateDecisionModule),
  },
  {
    path: "groupuser",
    //loadChildren: "./groupuser/groupuser.module#GroupUserModule",
    loadChildren: () => import("./groupuser/groupuser.module").then(m => m.GroupUserModule),
  },
  {
    path: "user",
    //loadChildren: "./user/user.module#UserModule",
    loadChildren: () => import("./user/user.module").then(m => m.UserModule),
  },
  {
    path: "userhidden",
    //loadChildren: "./user/user.module#UserModule",
    loadChildren: () => import("./userhidden/userhidden.module").then(m => m.UserHiddenModule),
  },
  {
    path: "grouppermission",
    //loadChildren:      "./groupuserpermission/groupuserpermission.module#GroupUserPermissionModule",
    loadChildren: () => import("./groupuserpermission/groupuserpermission.module").then(m => m.GroupUserPermissionModule),
  },
  {
    path: "userpermission",
    //loadChildren: "./userpermission/userpermission.module#UserPermissionModule",
    loadChildren: () => import("./userpermission/userpermission.module").then(m => m.UserPermissionModule),
  },
  {
    path: "settingreport",
    //loadChildren: "./settingreport/settingreport.module#SettingReportModule",
    loadChildren: () => import("./settingreport/settingreport.module").then(m => m.SettingReportModule),
  },
  {
    path: "settingremind",
    //loadChildren: "./settingremind/settingremind.module#SettingRemindModule",
    loadChildren: () => import("./settingremind/settingremind.module").then(m => m.SettingRemindModule),
  },
  {
    path: "settingmail",
    //loadChildren: "./settingmail/settingmail.module#settingmailModule",
    loadChildren: () => import("./settingmail/settingmail.module").then(m => m.SettingMailModule),
  },
  // {
  //   path: "otherlist",
  //   //loadChildren: "./applist/otherlist.module#OtherListModule",
  // },
  {
    path: "settingmap",
    //loadChildren: "./settingmap/settingmap.module#SettingMapModule",
    loadChildren: () => import("./settingmap/settingmap.module").then(m => m.SettingMapModule),
  },
  {
    path: "approveprocess",
    //loadChildren: "./approveprocess/approveprocess.module#ApproveProcessModule",
    loadChildren: () => import("./approveprocess/approveprocess.module").then(m => m.ApproveProcessModule),
  },
  {
    path: "approvetemplate",
    //loadChildren: "./approvetemplate/approvetemplate.module#ApproveTemplateModule",
    loadChildren: () => import("./approvetemplate/approvetemplate.module").then(m => m.ApproveTemplateModule),
  },
  {
    path: "reportdynamic",
    //loadChildren: "./approvetemplate/approvetemplate.module#ApproveTemplateModule",
    loadChildren: () => import("./reportdynamic/reportdynamic.module").then(m => m.ReportDynamicModule),
  },
  {
    path: "mailsetting",
    //loadChildren: "./approvetemplate/approvetemplate.module#ApproveTemplateModule",
    loadChildren: () => import("./mailsetting/mailsetting.module").then(m => m.MailSettingModule),
  },
  {
    path: "approvetemplatesetup",
    loadChildren: () => import("./approvetemplatesetup/approvetemplatesetup.module").then(m => m.ApproveTemplateSetupModule),
  },
  {
    path: "approvetemplatesetupemp",
    loadChildren: () => import("./approvetemplatesetupemp/approvetemplatesetupemp.module").then(m => m.ApproveTemplateSetupEmpModule),
  }
];
