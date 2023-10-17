import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SettingReportComponent } from "./settingreport.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DocumentEditorContainerModule } from "@syncfusion/ej2-angular-documenteditor";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: SettingReportComponent,
  },
];

@NgModule({
    declarations: [SettingReportComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        RichTextEditorAllModule,
        DocumentEditorContainerModule,
        LibrariesModule
    ]
})
export class SettingReportModule {}
