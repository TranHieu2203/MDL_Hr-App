import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryStructureComponent } from "./salarystructure.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryStructureEditComponent } from "./edit/salarystructure-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryStructureComponent,
  },
  {
    path: ":id",
    component: SalaryStructureEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [SalaryStructureComponent, SalaryStructureEditComponent],
  providers: [CoreService],
})
export class SalaryStructureModule {}
