import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryStructureSysComponent } from "./salarystructuresys.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryStructureSysEditComponent } from "./edit/salarystructuresys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: SalaryStructureSysComponent,
  },
  {
    path: ":id",
    component: SalaryStructureSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule],
  declarations: [SalaryStructureSysComponent, SalaryStructureSysEditComponent],
  providers: [CoreService],
})
export class SalaryStructureSysModule {}
