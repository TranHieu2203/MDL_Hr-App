import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeSheetFormulaComponent } from "./timesheetformula.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TimeSheetFormulaComponent,
  },
];

@NgModule({
    declarations: [TimeSheetFormulaComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class TimeSheetFormulaModule {}
