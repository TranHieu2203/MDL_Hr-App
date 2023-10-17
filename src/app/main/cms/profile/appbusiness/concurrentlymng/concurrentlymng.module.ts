import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ConcurrentlyMngComponent } from "./concurrentlymng.component";
import { CoreService } from "src/app/_services/core.service";
import { ConcurrentlyMngEditComponent } from "./edit/concurrentlymng-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: ConcurrentlyMngComponent,
  },
  {
    path: ":id",
    component: ConcurrentlyMngEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ConcurrentlyMngComponent, ConcurrentlyMngEditComponent],
  providers: [CoreService],
})
export class ConcurrentlyMngModule {}
