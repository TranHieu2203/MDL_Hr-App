import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ShiftCycleComponent } from "./shiftcycle.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: ShiftCycleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [ShiftCycleComponent],
  providers: [CoreService],
})
export class ShiftCycleModule {}
