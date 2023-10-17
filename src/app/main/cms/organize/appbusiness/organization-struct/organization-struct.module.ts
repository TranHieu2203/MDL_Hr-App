import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TreeGridModule } from "@syncfusion/ej2-angular-treegrid";
import {
  PageService,
  SortService,
  FilterService,
} from "@syncfusion/ej2-angular-treegrid";
import { OrganizationComponent } from "./organization-struct.component";
import { RouterModule, Routes } from "@angular/router";
import { TlaSharedModule } from 'src/app/components/shared.module';
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: OrganizationComponent,
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
    TreeGridModule,
  ],
  // declarations: [DisciplineComponent, DisciplineEditComponent],
  // providers: [CoreService],

  // imports: [
  //     // BrowserModule,
  //     TreeGridModule
  // ],
  declarations: [OrganizationComponent],
  bootstrap: [OrganizationComponent],
  providers: [PageService, SortService, FilterService],
})
export class OrganazitionStructModule {}
