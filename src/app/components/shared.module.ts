import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

import {
  DropDownListAllModule,
  DropDownListModule,
  ListBoxAllModule,
  AutoCompleteAllModule,
  MultiSelectModule,
  MultiSelectAllModule,
} from "@syncfusion/ej2-angular-dropdowns";

import { DatePickerAllModule, DateTimePickerAllModule } from "@syncfusion/ej2-angular-calendars";

import {
  NumericTextBoxAllModule,
  MaskedTextBoxAllModule,
  ColorPickerAllModule,
  TextBoxAllModule,
  MaskedTextBoxModule,
} from "@syncfusion/ej2-angular-inputs";

import { DialogModule, TooltipModule } from "@syncfusion/ej2-angular-popups";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";

import { GridAllModule } from "@syncfusion/ej2-angular-grids";
import {
  ButtonModule,
  CheckBoxAllModule,
  SwitchAllModule,
} from "@syncfusion/ej2-angular-buttons";
import {
  CheckBoxModule,
  RadioButtonModule,
} from "@syncfusion/ej2-angular-buttons";

import { TreeGridModule } from "@syncfusion/ej2-angular-treegrid";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ModalModule } from "src/app/components/modals/modals.module";
import { ListViewModule } from "@syncfusion/ej2-angular-lists";
import {
  TreeViewAllModule,
  AccordionModule,
} from "@syncfusion/ej2-angular-navigations";
import { CKEditorModule } from "ckeditor4-angular";
import { HighchartsChartModule } from "highcharts-angular";
import { TreeViewModule } from "@syncfusion/ej2-angular-navigations";

import { ModalsEmpComponent } from "./modalsemp/modalsemp.component";
import { SplitterModule } from "@syncfusion/ej2-angular-layouts";
import { ModalsOrgComponent } from "./modalsorganization/modalsorganization.component";
import { ModalsdecisionComponent } from "./modalsdecision/modalsdecision.component";
import { ListEmployeeComponent } from "./listemployee/listemployee.component";
import { ListOrgComponent } from "./listorg/listorg.component";
import { ModalsTimeSheetComponent } from "./modalstimesheet/modalstimesheet.component";
import { ModalsTimeSheetRootComponent } from "./modalstimesheetroot/modalstimesheetroot.component";
import { ModalsShiftSortComponent } from "./modalsshiftsort/modalsshiftsort.component";
import { ModalsRegisterOffComponent } from "./modalsregisteroff/modalsregisteroff.component";
import { OrganizationComponent } from "./organization/organization.component";
import { ModalsOvertimeComponent } from "./overtime/modalsovertime.component";
import { AgmCoreModule } from "@agm/core";
import { MapCoreComponent } from "./map/map.component";
import { DiagramModule } from "@syncfusion/ej2-angular-diagrams";
import { HistoryDecisionComponent } from "./historydecision/historydecision.component";
import { HistoryDisciplineComponent } from "./historydiscipline/historydiscipline.component";
import { HistoryContractComponent } from "./historycontract/historycontract.component";
import { HistorycommendComponent } from "./historycommend/historycommend.component";
import { HistoryInschangeComponent } from "./historyinschange/historyinschange.component";
import { HistoryWorkingBeforeComponent } from "./historyworkingbefore/historyworkingbefore.component";
import { HistoryTrainingBeforeComponent } from "./historytrainingbefore/historytrainingbefore.component";
import { MapMultiMarkerComponent } from "./mapmultimarker/mapmultimarker.component";
import { ModalsPositionComponent } from "./modalsposition/modalsposition.component";
import { FormControlPipe } from "@mdl-component/pipe/formControl.pipe";
//import { CommonToolsComponent } from './common-tools/common-tools.component';
@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ModalModule,
    // Syncfusion Module
    DropDownListAllModule,
    ListBoxAllModule,
    DatePickerAllModule,
    NumericTextBoxAllModule,
    TextBoxAllModule,
    DialogModule,
    GridAllModule,
    ButtonModule,
    CheckBoxModule,
    RadioButtonModule,
    TreeGridModule,
    TimePickerModule,
    CheckBoxAllModule,
    MaskedTextBoxAllModule,
    ListViewModule,
    ColorPickerAllModule,
    TreeViewAllModule,
    CKEditorModule,
    SwitchAllModule,
    TooltipModule,
    DatePickerModule,
    HighchartsChartModule,
    MultiSelectModule,
    MultiSelectAllModule,
    SplitterModule,
    MaskedTextBoxModule,
    AccordionModule,
    DateTimePickerAllModule,
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: "AIzaSyAFMusygo3Z54bPWYmCgTu934sa_fnquAI",
      libraries: ["drawing", "places"],
    }),
    DialogModule,
    DiagramModule,
  ],
  declarations: [
    ModalsEmpComponent,
    ModalsOrgComponent,
    ModalsdecisionComponent,
    ListEmployeeComponent,
    ListOrgComponent,
    ModalsTimeSheetComponent,
    ModalsTimeSheetRootComponent,
    ModalsShiftSortComponent,
    ModalsRegisterOffComponent,
    OrganizationComponent,
    ModalsOvertimeComponent,
    MapCoreComponent,
    MapMultiMarkerComponent,
    HistoryDecisionComponent,
    HistoryDisciplineComponent,
    HistoryContractComponent,
    HistorycommendComponent,
    HistoryInschangeComponent,
    HistoryWorkingBeforeComponent,
    HistoryTrainingBeforeComponent,
    ModalsPositionComponent,
    //CommonToolsComponent,
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    // Syncfusion Module
    DropDownListAllModule,
    DropDownListModule,
    ListBoxAllModule,
    DatePickerAllModule,
    DateTimePickerAllModule,
    NumericTextBoxAllModule,
    TextBoxAllModule,
    DialogModule,
    GridAllModule,
    ButtonModule,
    CheckBoxModule,
    RadioButtonModule,
    TreeGridModule,
    TimePickerModule,
    MaskedTextBoxAllModule,
    AutoCompleteAllModule,
    ColorPickerAllModule,
    TreeViewAllModule,
    CKEditorModule,
    SwitchAllModule,
    TooltipModule,
    HighchartsChartModule,
    MultiSelectModule,
    TreeViewModule,
    MultiSelectAllModule,
    ModalsEmpComponent,
    ModalsOrgComponent,
    SplitterModule,
    MaskedTextBoxModule,
    AgmCoreModule,
    ModalsPositionComponent,

    //CommonToolsComponent,
    ModalsdecisionComponent,
    ModalsTimeSheetComponent,
    ModalsTimeSheetRootComponent,
    ModalsShiftSortComponent,
    ListEmployeeComponent,
    ListOrgComponent,
    ModalsRegisterOffComponent,
    OrganizationComponent,
    AccordionModule,
    ModalsOvertimeComponent,
    MapCoreComponent,
    MapMultiMarkerComponent,
    HistoryDecisionComponent,
    HistoryDisciplineComponent,
    HistoryContractComponent,
    HistorycommendComponent,
    HistoryInschangeComponent,
    HistoryWorkingBeforeComponent,
    HistoryTrainingBeforeComponent,
  ],
})
export class TlaSharedModule { }
