import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RcRequestComponent } from "./rcrequest.component";
import { CoreService } from "src/app/_services/core.service";
import { RcRequestEditComponent } from "./edit/rcrequest-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: RcRequestComponent,
  },
  {
    path: ":id",
    component: RcRequestEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [RcRequestComponent, RcRequestEditComponent],
  providers: [CoreService],
})
export class RcRequestModule {}
