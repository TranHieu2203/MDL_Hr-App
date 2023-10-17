import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LibrariesModule } from "src/app/libraries/libraries.module";

import { CandidateComponent } from "./candidate.component";
import { CoreService } from "src/app/_services/core.service";
import { CandidateEditComponent } from "./edit/candidate-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
const routes: Routes = [
  {
    path: "",
    component: CandidateComponent,
  },
  {
    path: ":id",
    component: CandidateEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [CandidateComponent, CandidateEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class CandidateModule { }
