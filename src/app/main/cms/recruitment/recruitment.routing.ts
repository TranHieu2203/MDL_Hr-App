import{Routes} from "@angular/router";
import { Error404Component } from "../../errors/404/error-404.component";

export const RecruitmentRoutes: Routes = [
  {
    path: "",
    redirectTo: "/cms/organize/dashboarddetail/dashboarddetail",
    pathMatch: "full",
  },
 
  {
    path: "business",
    loadChildren: () => import("./appbusiness/recruimentbusiness.module").then(m => m.OrganizeBusinessModule),
  },
  {
    path: "list",
    //loadChildren: "./applist/attendancelist.module#AttendanceListModule",
    loadChildren: () => import("./applist/recruitmentlist.module").then(m => m.RecruitmentListModule),
  },
  {
    path: "**",
    component: Error404Component,
  },
];