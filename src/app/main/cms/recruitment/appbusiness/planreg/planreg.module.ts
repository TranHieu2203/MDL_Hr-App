import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PlanRegComponent } from "./planreg.component";
import { CoreService } from "src/app/_services/core.service";
import { PlanRegEditComponent } from "./edit/planreg-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: PlanRegComponent,
  },
  {
    path: ":id",
    component: PlanRegEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [PlanRegComponent, PlanRegEditComponent],
  providers: [CoreService],
})
export class PlanRegModule {}
