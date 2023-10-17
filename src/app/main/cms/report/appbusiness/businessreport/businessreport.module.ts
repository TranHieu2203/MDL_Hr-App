import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BusinessReportComponent } from "./businessreport.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { ReportInsComponent } from "./reportins/reportins.component";
import { ReportEmployeeComponent } from "./reportemployee/reportemployee.component";
import { ReportAttandenceComponent } from "./reportattandence/reportattandence.component";
import { ReportPayrollComponent } from "./reportpayroll/reportpayroll.component";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { ReportInsByOrgComponent } from "./reportinsbyorg/reportinsbyorg.component";
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

const routes: Routes = [
  {
    path: "",
    component: BusinessReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), 
    TlaSharedModule, 
    LibrariesModule,   
    SpreadsheetAllModule,
    ListViewModule
],
  declarations: [
    BusinessReportComponent,
    ReportInsComponent,
    ReportEmployeeComponent,
    ReportInsByOrgComponent,
    ReportAttandenceComponent,
    ReportPayrollComponent
  ],
  providers: [CoreService, ExcelExportService],
})
export class BusinessReportModule {}
