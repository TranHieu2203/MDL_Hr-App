import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrganizeReportRoutes } from "./organizereport.routing";

@NgModule({
  imports: [RouterModule.forChild(OrganizeReportRoutes)],
})
export class OrganizeReportModule {}
