import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingMapComponent } from "./settingmap.component";
import { SettingmapEditComponent } from "./edit/settingmap-edit.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SettingMapComponent,
  },{
    path: ':id',
    component: SettingmapEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [SettingMapComponent, SettingmapEditComponent],
  providers: [CoreService],
})
export class SettingMapModule {}
