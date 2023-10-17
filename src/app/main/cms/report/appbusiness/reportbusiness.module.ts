import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReportBusinessRoutes } from "./reportbusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(ReportBusinessRoutes)],
})
export class ReportBusinessModule {}
