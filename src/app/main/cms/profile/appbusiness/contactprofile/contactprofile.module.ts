import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LibrariesModule } from "src/app/libraries/libraries.module";

import { ContactProfileComponent } from "./contactprofile.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
const routes: Routes = [
  {
    path: "",
    component: ContactProfileComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ContactProfileComponent],
  providers: [CoreService, ExcelExportService],
})
export class ContactProfileModule {}
