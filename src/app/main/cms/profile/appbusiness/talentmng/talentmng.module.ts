import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TalentMngComponent } from "./talentmng.component";
import { CoreService } from "src/app/_services/core.service";
import { StaffProfileEditComponent } from "./edit/staffprofile-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TalentMngComponent,
  },
  {
    path: ":id",
    component: StaffProfileEditComponent,
  },
];

@NgModule({
    declarations: [TalentMngComponent, StaffProfileEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class TalentMngModule {}
