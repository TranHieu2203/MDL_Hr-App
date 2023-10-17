import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OrgChartComponent } from "./orgchart.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import {
  HierarchicalTreeService,
  DataBindingService,
  DiagramModule,
  OverviewModule,
} from "@syncfusion/ej2-angular-diagrams";

const routes: Routes = [
  {
    path: "",
    component: OrgChartComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    TlaSharedModule,
    DiagramModule,
    OverviewModule,
  ],
  declarations: [OrgChartComponent],
  providers: [CoreService, 
    HierarchicalTreeService,
    DataBindingService],
})
export class OrgChartModule {}
