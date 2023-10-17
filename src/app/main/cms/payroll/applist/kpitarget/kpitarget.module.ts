import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { KpiTargetComponent } from "./kpitarget.component";
import { CoreService } from "src/app/_services/core.service";
import { KpiTargetEditComponent } from "./edit/kpitarget-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: KpiTargetComponent,
  },
  {
    path: ":id",
    component: KpiTargetEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [KpiTargetComponent, KpiTargetEditComponent],
  providers: [CoreService],
})
export class KpiTargetModule {}
