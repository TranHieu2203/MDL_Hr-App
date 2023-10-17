import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrganizeDashboardDetailRoutes } from "./organizedashboarddetail.routing";

@NgModule({
  imports: [RouterModule.forChild(OrganizeDashboardDetailRoutes)],
})
export class OrganizeDashboardDetailModule {}
