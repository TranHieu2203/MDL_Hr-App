import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ReportsComponent } from "./reports.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { ReportProfileComponent } from "./reportprofile/reportprofile.component";
import { ReportSalaryComponent } from "./reportsalary/reportsalary.component";
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: "",
    component: ReportsComponent,
  },
];

@NgModule({
    declarations: [
        ReportsComponent,
        ReportProfileComponent,
        ReportSalaryComponent
    ],
    providers: [CoreService, ExcelExportService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class ReportsModule {}
