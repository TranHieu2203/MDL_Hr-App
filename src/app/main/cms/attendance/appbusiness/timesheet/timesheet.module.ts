import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeSheetComponent } from "./timesheet.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { TimeSheetStandardComponent } from "./timesheetstandard/timesheetstandard.component";
import { TimeSheetMonthlyComponent } from "./timesheetmonthly/timesheetmonthly.component";
import { TimeSheetRootComponent } from './timesheetroot/timesheetroot.component';

const routes: Routes = [
  {
    path: "",
    component: TimeSheetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [
    TimeSheetComponent,
    TimeSheetStandardComponent,
    TimeSheetMonthlyComponent,
    TimeSheetRootComponent
  ],
  providers: [CoreService],
})
export class TimeSheetModule {}
