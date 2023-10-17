import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InsRegimeMngComponent } from "./insregimemng.component";
import { CoreService } from "src/app/_services/core.service";
import { InsRegimeMngEditComponent } from "./edit/insregimemng-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: InsRegimeMngComponent,
  },
  {
    path: ":id",
    component: InsRegimeMngEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [InsRegimeMngComponent, InsRegimeMngEditComponent],
  providers: [CoreService],
})
export class InsRegimeMngModule {}
