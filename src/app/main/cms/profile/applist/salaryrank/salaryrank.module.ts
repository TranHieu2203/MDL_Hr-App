import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryRankComponent } from "./salaryrank.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryRankEditComponent } from "./edit/salaryrank-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryRankComponent,
  },
  {
    path: ":id",
    component: SalaryRankEditComponent,
  },
];

@NgModule({
    declarations: [SalaryRankComponent, SalaryRankEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class SalaryRankModule {}
