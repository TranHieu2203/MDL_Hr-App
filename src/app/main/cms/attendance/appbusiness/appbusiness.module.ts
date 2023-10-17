import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AttendanceBusinessRoutes } from "./appbusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(AttendanceBusinessRoutes)],
})
export class AttendanceBusinessModule {}
