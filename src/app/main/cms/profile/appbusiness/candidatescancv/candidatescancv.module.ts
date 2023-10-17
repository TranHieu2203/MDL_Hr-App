import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CandidatescancvComponent } from "./candidatescancv.component";
import { CoreService } from "src/app/_services/core.service";
import { CandidatescancvEditComponent } from "./edit/candidatescancv-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CandidatescancvComponent,
  },
  {
    path: ":id",
    component: CandidatescancvEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [CandidatescancvComponent, CandidatescancvEditComponent],
  providers: [CoreService],
})
export class CandidatescancvModule {}
