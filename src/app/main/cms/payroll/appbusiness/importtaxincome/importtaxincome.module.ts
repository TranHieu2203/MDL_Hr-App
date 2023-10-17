import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ImportTaxincomeComponent } from "./importtaxincome.component";
import { CoreService } from "src/app/_services/core.service";
//import { ImportPayrollEditComponent } from "./edit/importtaxincome-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: ImportTaxincomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ImportTaxincomeComponent],
  providers: [CoreService],
})
export class ImportTaxincomeModule {}
