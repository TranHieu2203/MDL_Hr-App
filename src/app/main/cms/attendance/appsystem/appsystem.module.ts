import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AttendanceSystemRoutes } from "./appsystem.routing";

@NgModule({
  imports: [RouterModule.forChild(AttendanceSystemRoutes)],
})
export class AttendanceSystemModule {}
