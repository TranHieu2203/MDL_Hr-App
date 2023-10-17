import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

// Service Translate
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Import the locale files
import { locale as english } from "src/app/i18n/en";
import { locale as vietnam } from "src/app/i18n/vi";
// Globals File
import { Globals } from "src/app/common/globals";
import { Configs } from "src/app/common/configs";
import { Notification } from "src/app/common/notification";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
const _ = require("lodash");
import { LayoutOrientation, LayoutAnimation, SubTreeOrientation, SubTreeAlignments, Node, DataBinding, HierarchicalTree, AnnotationConstraints, ConnectorModel, Container, DataSourceModel, Diagram, DiagramComponent, DiagramConstraints, DiagramTools, DiagramTooltip, IExportOptions, ImageElement, LayoutModel, NodeModel, PrintAndExport, RadialGradientModel, ScrollSettingsModel, ShapeStyleModel, SnapConstraints, SnapSettingsModel, StackPanel, TextElement, TextModel, TreeInfo } from "@syncfusion/ej2-angular-diagrams";
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
  ToolbarItem,
  ToolbarInterface
} from "src/app/_models/index";
Diagram.Inject(PrintAndExport);
setCulture("en");

import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';



Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface EmployeeInfo {
  Role: string;
  color: string;
}
export interface DataInfo {
  key: string;
}



@Component({
  selector: "cms-app-orgchart",
  templateUrl: "./orgchart.component.html",
  styleUrls: ["./orgchart.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class OrgChartComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // View child Grid
  @ViewChild("diagram", { static: true })
  public diagram!: DiagramComponent;
  public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
  public scrollSettings: ScrollSettingsModel = { scrollLimit: 'Infinity' };
  public tool: DiagramTools = DiagramTools.ZoomPan;
  public items!: DataManager;
  public dataSourceSettings!: DataSourceModel;
  public options!: IExportOptions;

  //Initializes data source

  public lstOrg!: object;

  public created() {
    this.diagram.fitToPage();
  }
  //Sets the default properties for all the Nodes
  public getNodeDefaults(obj: NodeModel, diagram: Diagram): NodeModel {
    obj.style = {
      fill: 'none',
      strokeColor: 'gray',
      strokeWidth: 1,
      bold: true,
      color: '#33333',

    };
    obj.collapseIcon!.offset = {
      x: .5,
      y: 1
    }
    obj.expandIcon = {
      height: 12,
      width: 12,
      shape: "Plus",
      fill: 'none',
      offset: {
        x: .5,
        y: 1
      }
    }

    obj.collapseIcon!.height = 12;
    obj.collapseIcon!.width = 12;
    obj.collapseIcon!.shape = "Minus";
    //obj.width = 75;
    (obj.shape as TextModel).margin = {
      left: 15,
      right: 15,
      top: 15,
      bottom: 15
    };
    obj.shape = { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 };
    obj.style = { strokeWidth: 1 };
    obj.width = 400;
    obj.height = 100;
    obj.shadow = {
      opacity: 1,
      distance: 100,
      angle: 50,
      color: "red"
    }

    return obj;

  }
  //Sets the default properties for all the connectors
  public getConnectorDefaults(connector: ConnectorModel, diagram: Diagram): ConnectorModel {
    connector.targetDecorator!.shape = 'None';
    //   connector.type = 'Orthogonal';
    connector.style!.strokeColor = 'gray';

    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator!.height = 7;
    connector.targetDecorator!.width = 7;
    connector.style = { strokeColor: '#000080', strokeWidth: 2 };
    connector.targetDecorator!.style!.fill = '#6BA5D7';
    connector.targetDecorator!.style!.strokeColor = '#6BA5D7';

    return connector;
  }
  public layout: LayoutModel = {

    type: 'OrganizationalChart',
    enableAnimation: true
  };

  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;


  elementHeight = 0;
  elementWidth = 0;


  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private el: ElementRef,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    this.snapSettings = {
      constraints: 0
    }
    this.loadData();
  
    this.elementHeight = this.el.nativeElement.offsetHeight;
    this.elementWidth = this.el.nativeElement.offsetWidth
  }

  loadData() {
    this.getListOrg().then((res: any) => {
      this.items = new DataManager(res as JSON[]);
      this.dataSourceSettings = {
        id: 'id',
        parentId: 'pid',
        dataSource: this.items,
        //binds the external data with node
        doBinding: (nodeModel: NodeModel, data: DataInfo, diagram: Diagram) => {
          nodeModel.annotations = [
            {
              /* tslint:disable:no-string-literal */
              //content: data.image == null ? " ":  data.image,
              id: "img",
              template: `<img class="img-manager" width="40px" height="40px" style="border-radius: 50%" src="` + data['image'] + `" />`,
              margin: { top: -25 },
              //style :'Auto' 
              height: 40,
              width: 40,
              constraints: AnnotationConstraints.ReadOnly

            },

            {
              content: data['name'],
              margin: { top: 15, left: 10, right: 10, bottom: 0 },
              style: { color: '#2095F4', bold: true, fontSize: 16 },
              constraints: AnnotationConstraints.ReadOnly
            },
            // {
            //   /* tslint:disable:no-string-literal */
            //   content: data['orgManager'] == null ? " " : data['orgManager'],
            //   margin: { top: 32, left: 10, right: 10, bottom: 0 },
            //   style: { color: '#2095F4' },
            //   constraints: AnnotationConstraints.ReadOnly
            // },
            // {
            //   /* tslint:disable:no-string-literal */
            //   content: "",
            //   margin: { top: 45, left: 10, right: 10, bottom: 0 },
            //   height: 12,
            //   width: 400,
            //   style: { color: '#2095F4', fill: "#2095F4" },
            //   constraints: AnnotationConstraints.ReadOnly
            // },

          ];
          /* tslint:disable:no-string-literal */
          nodeModel.style = {
            fill: '#2095F4',
            strokeColor: '#2095F4',
            strokeWidth: 1,
          };
        }
      }

    });
  }
  getListOrg() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/organization/GetList").subscribe((res: any) => {
        resolve(res.data);
      });
    });

  }
  // Build Toolbar

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.PRINT:
        this.options = {};
        this.options.mode = 'Data';
        this.options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
        this.options.fileName = 'region';
        this.options.format = 'PNG';
        this.options.region = 'PageSettings';
        this.diagram.print(this.options);

        break;
      default:
        break;
    }
  };
}


export interface DataInfo {
  [key: string]: string;
}

