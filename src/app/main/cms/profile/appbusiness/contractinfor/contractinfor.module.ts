import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ContractInforComponent } from "./contractinfor.component";
import { CoreService } from "src/app/_services/core.service";
import { ContractInforEditComponent } from "./edit/contractinfor-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { MdlExpansionModule } from "@mdl-layout/mdl-expansion/mdl-expansion.module";
import { MdlCardModule } from "@mdl-layout/mdl-card/mdl-card.module";
import { MdlInputModule } from "@mdl-component/mdl-input/mdl-input.module";
import { PipesModule } from "@mdl-component/pipe/pipes.module";
import { MdlEmployeeModule } from "@mdl-component/mdl-employee/mdl-employee.module";


const routes: Routes = [
  {
    path: "",
    component: ContractInforComponent,
  },
  {
    path: ":id",
    component: ContractInforEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, PipesModule, AccordionModule, LibrariesModule, MdlExpansionModule, MdlCardModule, MdlInputModule, MdlEmployeeModule
  ],
  declarations: [ContractInforComponent, ContractInforEditComponent],
  providers: [CoreService],
})
export class ContractInforModule { }
