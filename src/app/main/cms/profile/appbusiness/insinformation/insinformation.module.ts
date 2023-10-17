import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InsInformationComponent } from "./insinformation.component";
import { CoreService } from "src/app/_services/core.service";
import { InsInformationEditComponent } from "./edit/insinformation-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: InsInformationComponent,
  },
  {
    path: ":id",
    component: InsInformationEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [InsInformationComponent, InsInformationEditComponent],
  providers: [CoreService],
})
export class InsInformationModule {}
