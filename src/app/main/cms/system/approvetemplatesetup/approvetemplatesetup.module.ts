import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ApproveTemplateSetupComponent } from "./approvetemplatesetup.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ApproveTemplateSetupComponent,
  }
];

@NgModule({
    declarations: [ApproveTemplateSetupComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class ApproveTemplateSetupModule {}
