import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PerfomanceBusinessRoutes } from "./perfomancebusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(PerfomanceBusinessRoutes)],
})
export class OrganizeBusinessModule {}
