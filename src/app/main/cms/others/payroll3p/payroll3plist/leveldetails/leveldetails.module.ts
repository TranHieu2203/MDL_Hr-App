import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LevelDetailsComponent } from "./leveldetails.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";


const routes: Routes = [
  {
    path: "",
    component: LevelDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule],
  declarations: [LevelDetailsComponent],
  providers: [CoreService],
})
export class LevelDetailsModule {}
