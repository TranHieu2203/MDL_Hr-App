import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryElementComponent } from "./salaryelement.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryElementEditComponent } from "./edit/salaryelement-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryElementComponent,
  },
  {
    path: ":id",
    component: SalaryElementEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [SalaryElementComponent, SalaryElementEditComponent],
  providers: [CoreService],
})
export class SalaryElementModule {}
