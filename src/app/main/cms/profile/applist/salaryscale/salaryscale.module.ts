import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryScaleComponent } from "./salaryscale.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryScaleEditComponent } from "./edit/salaryscale-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryScaleComponent,
  },
  {
    path: ":id",
    component: SalaryScaleEditComponent,
  },
];

@NgModule({
    declarations: [SalaryScaleComponent, SalaryScaleEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class SalaryScaleModule {}
