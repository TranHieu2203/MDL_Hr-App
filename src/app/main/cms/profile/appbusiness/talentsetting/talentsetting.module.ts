import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TalentSettingComponent } from "./talentsetting.component";
import { CoreService } from "src/app/_services/core.service";
import { TalentSettingEditComponent } from "./edit/talentsetting-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TalentSettingComponent,
  },
  {
    path: ":id",
    component: TalentSettingEditComponent,
  },
];

@NgModule({
    declarations: [TalentSettingComponent, TalentSettingEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class TalentSettingModule {}
