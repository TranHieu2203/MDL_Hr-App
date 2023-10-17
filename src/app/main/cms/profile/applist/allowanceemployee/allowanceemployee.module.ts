import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AllowanceEmployeeComponent } from "./allowanceemployee.component";
import { CoreService } from "src/app/_services/core.service";
import { AllowanceEmployeeEditComponent } from "./edit/allowanceemployee-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: AllowanceEmployeeComponent,
  },
  {
    path: ":id",
    component: AllowanceEmployeeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [AllowanceEmployeeComponent, AllowanceEmployeeEditComponent],
  providers: [CoreService],
})
export class AllowanceEmployeeModule {}
