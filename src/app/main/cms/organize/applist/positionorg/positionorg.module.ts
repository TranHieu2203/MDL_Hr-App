import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PositionOrgComponent } from "./positionorg.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: PositionOrgComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [PositionOrgComponent],
  providers: [CoreService],
})
export class PositionOrgModule {}
