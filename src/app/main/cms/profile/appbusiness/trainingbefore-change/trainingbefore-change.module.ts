import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TrainingBeforeChangeComponent } from "./trainingbefore-change.component";
import { CoreService } from "src/app/_services/core.service";
import { TrainingBeforeChangeEditComponent } from "./edit/trainingbefore-change-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: TrainingBeforeChangeComponent,
  },
  {
    path: ":id",
    component: TrainingBeforeChangeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [TrainingBeforeChangeComponent, TrainingBeforeChangeEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class TrainingBeforeChangeModule {}
