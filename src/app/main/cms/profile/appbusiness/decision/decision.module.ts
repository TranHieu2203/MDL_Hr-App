import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DecisionComponent } from "./decision.component";
import { CoreService } from "src/app/_services/core.service";
import { DecisionEditComponent } from "./edit/decision-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: DecisionComponent,
  },
  {
    path: ":id",
    component: DecisionEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [DecisionComponent, DecisionEditComponent],
  providers: [CoreService],
})
export class DecisionModule {}
