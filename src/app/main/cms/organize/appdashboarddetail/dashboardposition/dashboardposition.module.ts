import { NgModule } from "@angular/core";
import { TreeGridModule } from "@syncfusion/ej2-angular-treegrid";
import {
  PageService,
  SortService,
  FilterService,
} from "@syncfusion/ej2-angular-treegrid";
import { DashboardPositionComponent } from "./dashboardposition.component";
import { RouterModule, Routes } from "@angular/router";
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { EditService, CommandColumnService } from '@syncfusion/ej2-angular-grids';

const routes: Routes = [
  {
    path: "",
    component: DashboardPositionComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    AccordionModule,
    TreeGridModule,
  ],
  declarations: [DashboardPositionComponent],
  bootstrap: [DashboardPositionComponent],
  providers: [PageService, SortService, FilterService,EditService,CommandColumnService],
})
export class DashboardPositionModule {}
