import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CapacityRoutes } from "./capacity.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(CapacityRoutes), Error404Module],
})
export class CapacityModule {}
