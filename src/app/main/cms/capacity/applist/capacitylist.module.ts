import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CapacityListRoutes } from "./capacitylist.routing";

@NgModule({
  imports: [RouterModule.forChild(CapacityListRoutes)],
})
export class CapacityListModule {}
