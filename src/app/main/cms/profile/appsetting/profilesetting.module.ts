import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfileSettingRoutes } from "./profilesetting.routing";

@NgModule({
  imports: [RouterModule.forChild(ProfileSettingRoutes)],
})
export class ProfileSettingModule {}
