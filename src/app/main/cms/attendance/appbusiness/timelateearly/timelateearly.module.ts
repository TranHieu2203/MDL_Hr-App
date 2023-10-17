import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeLateEarlyComponent } from "./timelateearly.component";
import { CoreService } from "src/app/_services/core.service";
import { TimeLateEarlyEditComponent } from "./edit/timelateearly-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TimeLateEarlyComponent,
  },
  {
    path: ":id",
    component: TimeLateEarlyEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [TimeLateEarlyComponent, TimeLateEarlyEditComponent],
  providers: [CoreService],
})
export class TimeLateEarlyModule {}
