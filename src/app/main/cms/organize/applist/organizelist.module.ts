import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrganizeListRoutes } from "./organizelist.routing";

@NgModule({
  imports: [RouterModule.forChild(OrganizeListRoutes)],
})
export class OrganizeListModule {}
