import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LibrariesModule } from "src/app/libraries/libraries.module";

import { RemindComponent } from "./remind.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
const routes: Routes = [
  {
    path: "",
    component: RemindComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [RemindComponent],
  providers: [CoreService, ExcelExportService],
})
export class RemindModule {}
