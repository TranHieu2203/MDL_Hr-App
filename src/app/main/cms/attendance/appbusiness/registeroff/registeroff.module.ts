import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RegisterOffComponent } from "./registeroff.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: RegisterOffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [RegisterOffComponent],
  providers: [CoreService],
})
export class RegisterOffModule {}
