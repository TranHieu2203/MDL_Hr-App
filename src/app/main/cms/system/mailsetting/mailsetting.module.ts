import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MailSettingComponent } from "./mailsetting.component";
import { CoreService } from "src/app/_services/core.service";
import { MailSettingEditComponent } from "./edit/mailsetting-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DocumentEditorContainerModule } from "@syncfusion/ej2-angular-documenteditor";
import { CommonModule } from "@angular/common";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: MailSettingComponent,
  },
  {
    path: ":id",
    component: MailSettingEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule,    RichTextEditorAllModule,
    DocumentEditorContainerModule, CommonModule, TlaSharedModule,LibrariesModule
  ],
  declarations: [MailSettingComponent, MailSettingEditComponent],
  providers: [CoreService],
})
export class MailSettingModule {}
