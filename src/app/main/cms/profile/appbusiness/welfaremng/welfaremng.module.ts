import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WelfareMngComponent } from "./welfaremng.component";
import { CoreService } from "src/app/_services/core.service";
import { WelfareMngEditComponent } from "./edit/welfaremng-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: WelfareMngComponent,
  },
  {
    path: ":id",
    component: WelfareMngEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [WelfareMngComponent, WelfareMngEditComponent],
  providers: [CoreService],
})
export class WelfareMngModule {}
