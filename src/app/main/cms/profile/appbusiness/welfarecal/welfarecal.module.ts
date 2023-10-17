import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WelfarecalComponent } from "./welfarecal.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: WelfarecalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [WelfarecalComponent],
  providers: [CoreService],
})
export class WelfarecalModule {}
