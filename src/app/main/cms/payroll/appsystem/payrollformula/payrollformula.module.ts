import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PayrollFormulaComponent } from "./payrollformula.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { PayrollFormulaEditComponent } from "./edit/payrollformula-edit.component";
import { TextareaHighlightModule } from 'src/app/components/textarea-highlight/textarea-highlight.module';
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: PayrollFormulaComponent,
  },
  {
    path: ":id",
    component: PayrollFormulaEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, TextareaHighlightModule, LibrariesModule],
  declarations: [PayrollFormulaComponent, PayrollFormulaEditComponent],
  providers: [CoreService],
})
export class PayrollFormulaModule {}
