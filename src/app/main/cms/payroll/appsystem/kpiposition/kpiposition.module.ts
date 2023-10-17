import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { KpiPositionComponent } from "./kpiposition.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: KpiPositionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [KpiPositionComponent],
  providers: [CoreService],
})
export class KpiPositionModule {}
