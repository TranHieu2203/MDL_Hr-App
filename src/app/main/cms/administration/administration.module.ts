import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdministrationRoutes } from "./administration.routing";

@NgModule({
  imports: [RouterModule.forChild(AdministrationRoutes)],
})
export class AdministrationModule {}
