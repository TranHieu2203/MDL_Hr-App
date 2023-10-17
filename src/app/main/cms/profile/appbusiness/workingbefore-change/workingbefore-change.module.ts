import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkingBeforeChangeComponent } from "./workingbefore-change.component";
import { CoreService } from "src/app/_services/core.service";
import { WorkingBeforeChangeEditComponent } from "./edit/workingbefore-change-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: WorkingBeforeChangeComponent,
  },
  {
    path: ":id",
    component: WorkingBeforeChangeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [WorkingBeforeChangeComponent, WorkingBeforeChangeEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class WorkingBeforeChangeModule {}
