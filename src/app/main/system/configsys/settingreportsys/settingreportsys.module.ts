import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingReportSysComponent } from "./settingreportsys.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DocumentEditorContainerModule } from "@syncfusion/ej2-angular-documenteditor";
const routes: Routes = [
  {
    path: "",
    component: SettingReportSysComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,

    RichTextEditorAllModule,
    DocumentEditorContainerModule,
  ],
  declarations: [SettingReportSysComponent],
  providers: [CoreService],
})
export class SettingReportSysModule {}
