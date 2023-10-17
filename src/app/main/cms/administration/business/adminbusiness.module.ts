import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminBusinessRoutes } from "./adminbusiness.routing";


@NgModule({
  imports: [RouterModule.forChild(AdminBusinessRoutes)],
})
export class AdminBusinessModule {
}
