import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrganizeRoutes } from "./organize.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(OrganizeRoutes), Error404Module],
})
export class OrganizeModule {}
