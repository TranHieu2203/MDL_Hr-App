import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Error404Module } from "../../errors/404/error-404.module";
import { AttendanceRoutes } from "./attendance.routing";

@NgModule({
  imports: [RouterModule.forChild(AttendanceRoutes), Error404Module],
})
export class AttendanceModule {}
