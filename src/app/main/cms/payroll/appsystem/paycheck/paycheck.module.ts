import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PayCheckComponent } from "./paycheck.component";
import { CoreService } from "src/app/_services/core.service";
import { PayCheckEditComponent } from "./edit/paycheck-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: PayCheckComponent,
  },
  {
    path: ":id",
    component: PayCheckEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [PayCheckComponent, PayCheckEditComponent],
  providers: [CoreService],
})
export class PaycheckModule {}
