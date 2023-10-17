import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SurveyComponent } from "./survey.component";
import { CoreService } from "src/app/_services/core.service";
import { SurveyEditComponent } from "./edit/survey-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: SurveyComponent,
  },
  {
    path: ":id",
    component: SurveyEditComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    RichTextEditorAllModule,
    LibrariesModule
  ],
  declarations: [SurveyComponent, SurveyEditComponent],
  providers: [CoreService],
})
export class SurveyModule {}
