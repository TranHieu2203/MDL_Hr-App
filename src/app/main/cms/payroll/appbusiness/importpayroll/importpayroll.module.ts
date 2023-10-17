import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ImportPayrollComponent } from "./importpayroll.component";
import { CoreService } from "src/app/_services/core.service";
import { ImportPayrollEditComponent } from "./edit/importpayroll-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: ImportPayrollComponent,
  },
  {
    path: ":id",
    component: ImportPayrollEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ImportPayrollComponent, ImportPayrollEditComponent],
  providers: [CoreService],
})
export class ImportPayrollModule {}
