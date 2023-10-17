import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryElementSysComponent } from "./salaryelementsys.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryElementSysEditComponent } from "./edit/salaryelementsys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: SalaryElementSysComponent,
  },
  {
    path: ":id",
    component: SalaryElementSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule],
  declarations: [SalaryElementSysComponent, SalaryElementSysEditComponent],
  providers: [CoreService],
})
export class SalaryElementSysModule {}
