import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrganizeBusinessRoutes } from "./recruimentbusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(OrganizeBusinessRoutes)],
})
export class OrganizeBusinessModule {}
