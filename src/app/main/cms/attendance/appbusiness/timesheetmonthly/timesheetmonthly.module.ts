import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeSheetMonthlyComponent } from "./timesheetmonthly.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: TimeSheetMonthlyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [TimeSheetMonthlyComponent],
  providers: [CoreService],
})
export class TimeSheetMonthlyModule {}
