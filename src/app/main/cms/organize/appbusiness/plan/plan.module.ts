import { NgModule } from "@angular/core";
import { PlanComponent } from "./plan.component";
import { RouterModule, Routes } from "@angular/router";
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { GridModule, PageService, SelectionService, RowDDService } from '@syncfusion/ej2-angular-grids';
const routes: Routes = [
  {
    path: "",
    component: PlanComponent,
  },
];

/**
 * Module
 */

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    AccordionModule,
    // BrowserModule,
    GridModule
  ],
  // declarations: [DisciplineComponent, DisciplineEditComponent],
  // providers: [CoreService],

  // imports: [
  //     // BrowserModule,
  //     TreeGridModule
  // ],
  declarations: [PlanComponent],
  bootstrap: [PlanComponent],
  providers: [PageService, SelectionService, RowDDService]
})
export class PlanModule {}
