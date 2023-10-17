import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ReportDynamicComponent } from "./report-dynamic.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { QueryBuilderModule } from '@syncfusion/ej2-angular-querybuilder';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

const routes: Routes = [
  {
    path: "",
    component: ReportDynamicComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
     TlaSharedModule,
      AccordionModule,
       LibrariesModule,
       QueryBuilderModule,
       SpreadsheetAllModule,
       ListViewModule
      ],
  declarations: [ReportDynamicComponent, ],
  providers: [CoreService],
})
export class ReportDynamicModule {}
