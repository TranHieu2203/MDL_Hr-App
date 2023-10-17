import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryLevelComponent } from "./salarylevel.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryLevelEditComponent } from "./edit/salarylevel-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryLevelComponent,
  },
  {
    path: ":id",
    component: SalaryLevelEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [SalaryLevelComponent, SalaryLevelEditComponent],
  providers: [CoreService],
})
export class SalaryLevelModule {}
