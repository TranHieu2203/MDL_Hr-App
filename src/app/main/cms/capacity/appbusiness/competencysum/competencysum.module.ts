import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetencySumComponent } from "./competencysum.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: CompetencySumComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [CompetencySumComponent],
  providers: [CoreService],
})
export class CompetencySumModule {}
