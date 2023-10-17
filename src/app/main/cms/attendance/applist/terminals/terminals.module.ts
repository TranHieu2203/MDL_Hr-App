import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TerminalsComponent } from "./terminals.component";
import { CoreService } from "src/app/_services/core.service";
import { TerminalsEditComponent} from "./edit/terminals-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TerminalsComponent,
  },
  {
    path: ":id",
    component: TerminalsEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [TerminalsComponent, TerminalsEditComponent],
  providers: [CoreService],
})
export class TerminalsModule {}
