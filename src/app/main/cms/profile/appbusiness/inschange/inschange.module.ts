import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InsChangeComponent } from "./inschange.component";
import { CoreService } from "src/app/_services/core.service";
import { InsChangeEditComponent } from "./edit/inschange-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: InsChangeComponent,
  },
  {
    path: ":id",
    component: InsChangeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [InsChangeComponent, InsChangeEditComponent],
  providers: [CoreService],
})
export class InsChangeModule {}
