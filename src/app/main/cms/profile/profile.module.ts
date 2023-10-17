import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfileRoutes } from "./profile.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(ProfileRoutes), Error404Module],
})
export class ProfileModule {}
