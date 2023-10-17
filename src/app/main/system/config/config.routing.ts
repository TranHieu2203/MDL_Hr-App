import { Routes } from "@angular/router";

export const SystemConfigRoutes: Routes = [
  {
    path: "groupfunction",
    //loadChildren:      "src/app/main/system/config/GroupFunction/GroupFunction.module#GroupFunctionModule",
    loadChildren: () => import("src/app/main/system/config/GroupFunction/GroupFunction.module").then(m => m.GroupFunctionModule),
  },
  {
    path: "module",
    //loadChildren: "src/app/main/system/config/Module/Module.module#ModuleModule",
    loadChildren: () => import("src/app/main/system/config/Module/Module.module").then(m => m.ModuleModule),
  },
  {
    path: "function",
    //loadChildren:      "src/app/main/system/config/Function/Function.module#FunctionModule",
    loadChildren: () => import("src/app/main/system/config/Function/Function.module").then(m => m.FunctionModule),
  },
  {
    path: "syspackage",
    //loadChildren:      "src/app/main/system/config/SysPackage/SysPackage.module#SysPackageModule",
    loadChildren: () => import("src/app/main/system/config/SysPackage/SysPackage.module").then(m => m.SysPackageModule),
  },
  {
    path: "groupuser",
    //loadChildren:      "src/app/main/system/config/groupuser/groupuser.module#GroupUserModule",
    loadChildren: () => import("src/app/main/system/config/groupuser/groupuser.module").then(m => m.GroupUserModule),
  },
  {
    path: "user",
    //loadChildren: "src/app/main/system/config/user/user.module#UserModule",
    loadChildren: () => import("src/app/main/system/config/user/user.module").then(m => m.UserModule),
  },
  {
    path: "groupuserpermission",
    //loadChildren:      "src/app/main/system/config/groupuserpermission/groupuserpermission.module#GroupUserPermissionModule",
    loadChildren: () => import("src/app/main/system/config/groupuserpermission/groupuserpermission.module").then(m => m.GroupUserPermissionModule),
  },
  {
    path: "userpermission",
    //loadChildren:      "src/app/main/system/config/userpermission/userpermission.module#UserPermissionModule",
    loadChildren: () => import("src/app/main/system/config/userpermission/userpermission.module").then(m => m.UserPermissionModule),
  },
  {
    path: "tenant",
    //loadChildren: "src/app/main/system/config/tenant/tenant.module#TenantModule",
    loadChildren: () => import("src/app/main/system/config/tenant/tenant.module").then(m => m.TenantModule),
  },
  {
    path: "tenantcontract",
    //loadChildren: "src/app/main/system/config/tenantcontract/tenantcontract.module#TenantContractModule",
    loadChildren: () => import("src/app/main/system/config/tenantcontract/tenantcontract.module").then(m => m.TenantContractModule),
  }
];
