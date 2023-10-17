import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PosPaperComponent } from "./pospaper.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: PosPaperComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [PosPaperComponent],
  providers: [CoreService],
})
export class PosPaperModule {}
