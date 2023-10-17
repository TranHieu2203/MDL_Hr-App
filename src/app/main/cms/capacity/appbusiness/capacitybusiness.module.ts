import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CapacityBusinessRoutes } from "./capacitybusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(CapacityBusinessRoutes)],
})
export class CapacityBusinessModule {}
