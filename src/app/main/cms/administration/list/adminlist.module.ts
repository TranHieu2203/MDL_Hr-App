import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminListRoutes } from "./adminlist.routing";


@NgModule({
  imports: [RouterModule.forChild(AdminListRoutes)],
})
export class AdminListModule {
}
