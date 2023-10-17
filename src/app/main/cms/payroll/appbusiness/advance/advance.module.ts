import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdvanceComponent } from "./advance.component";
import { CoreService } from "src/app/_services/core.service";
import { AdvanceEditComponent } from "./edit/advance-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "../../../../../libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: AdvanceComponent,
  },
  {
    path: ":id",
    component: AdvanceEditComponent,
  },
];

@NgModule({
    declarations: [AdvanceComponent, AdvanceEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule]
})
export class AdvanceModule {}
