import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AllowanceComponent } from "./allowance.component";
import { CoreService } from "src/app/_services/core.service";
import { AllowanceEditComponent } from "./edit/allowance-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: AllowanceComponent,
  },
  {
    path: ":id",
    component: AllowanceEditComponent,
  },
];

@NgModule({
    declarations: [AllowanceComponent, AllowanceEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class AllowanceModule {}
