import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { KpiGroupComponent } from "./kpigroup.component";
import { CoreService } from "src/app/_services/core.service";
import { KpiGroupEditComponent } from "./edit/kpigroup-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: KpiGroupComponent,
  },
  {
    path: ":id",
    component: KpiGroupEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule],
  declarations: [KpiGroupComponent, KpiGroupEditComponent],
  providers: [CoreService],
})
export class KpiGroupModule {}
