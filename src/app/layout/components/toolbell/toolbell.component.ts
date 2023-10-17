import {
  Component,
  ViewEncapsulation,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AuthService } from "src/app/common/auth.service";
import { Router } from "@angular/router";
import { CoreService } from "src/app/_services/core.service";
import { NavigationService } from "src/app/_services/navigation.service";
import { ModalService } from "src/app/_services/modal.service";
import { Globals } from "src/app/common/globals";
const $ = require("jquery");
import { FormBuilder, FormGroup } from "@angular/forms";
import { Notification } from "src/app/common/notification";
import { AccordionComponent } from "@syncfusion/ej2-angular-navigations";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from "@angular/animations";
import { ToolbellService } from "src/app/_services/toolbell.service";
@Component({
  selector: "app-toolbell",
  templateUrl: "./toolbell.component.html",
  styleUrls: ["./toolbell.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    // Define animation here
    trigger("myfirstanimation", [
      state(
        "small",
        style({
          height: "0px",
          opacity: '0',
        })
      ),
      state(
        "large",
        style({
          height: "*",
          opacity: '1',
        })
      ),
      transition("large => small", animate("400ms ease-out")),
      transition("small => large", animate("400ms ease-in")),
    ]),
    trigger("rotatedState", [
      state("small", style({ transform: "rotate(0)" })),
      state("large", style({ transform: "rotate(-180deg)" })),
      transition("large => small", animate("400ms ease-out")),
      transition("small => large", animate("400ms ease-in")),
    ]),
  ],
})
export class ToolbellComponent implements OnInit {
  hidden: boolean = true;
  data: any;
  total: string = "0";
  state: string = "small";
  public itemsData: any = [];
  public mapping = { header: "name", content: "code" };
  /**
   * Constructor
   */
  constructor(
    private notification: Notification,
    private _coreService: CoreService,
    private modalService: ModalService,
    public router: Router,
    private toolbellService: ToolbellService
  ) {

  }
  ngOnInit() {
    this.toolbellService.toolbellData$.subscribe((res: any) => {

      if (res.statusCode == 400) {
      } else {
        if (res.data != undefined) {
          let x = 0;
          res.data.forEach((element: any) => {
            element.state = "small";
            x += Number(element.count);
          });
          if (x < 99) {
            this.total = x.toString();
          } else {
            this.total = "99+";
          }
          this.data = res.data;
        }
      }
    })
  }
  showAccodion() {
    this.hidden = !this.hidden;
  }
  goTo(data:any){
    this.hidden = !this.hidden;
    this.router.navigate(["/hrms/profile/setting/remind"],{queryParams:{type:data.code}})
  }
  toggle(index: number) {
    let state = this.data[index].state;
    this.data[index].state = state === "small" ? "large" : "small";
  }
  getData() {
    this._coreService.Get("hr/FormList/getRemind").subscribe((res: any) => {
      //return;
      //check error
      if (res.statusCode == 400) {
        this.notification.checkErrorMessage(res.message);
      } else {
        let x = 0;
        res.data.forEach((element: any) => {
          element.state = "small";
          x += Number(element.count);
        });
        if (x < 99) {
          this.total = x.toString();
        } else {
          this.total = "99+";
        }
        this.data = res.data;
      }
    });
  }

  Directional(code: any, epm: any) {
    let url = "hr/employee/GetInforContract?Id=";
    let objParamAdd = { id: epm.id, type: "new" };
    let paramAdd = window.btoa(JSON.stringify(objParamAdd));

    switch (code) {
      case "EMP_EXPIRE_CONTRACT":
        this.router.navigate(["/hrms/profile/business/contractinfor/", paramAdd]);
        break;
      case "EMP_REGISTER_CONTRACT":
        this.router.navigate(["/hrms/profile/business/contractinfor/", paramAdd]);
        break;
      case "EMP_REGISTER_WORKING":
        this.router.navigate(["/hrms/profile/business/decision/", paramAdd]);
        break;
      case "EMP_REGISTER_INSURANCE":
        this._coreService.Get(url + epm.id).subscribe((res: any) => {
          localStorage.setItem("modelTemp1", JSON.stringify(res.data));
          setTimeout(() => {
            this.router.navigate(["/hrms/profile/business/insinformation/new"]);
          }, 200)
        });
        break;
      case "EMP_BIRTH_DAY":
        let objParamAdd1 = { id: epm.id, type: "view" };
        let paramAdd1 = window.btoa(JSON.stringify(objParamAdd1));
        this.router.navigate(["/hrms/profile/business/staffprofile/", paramAdd1]);
        break;
      case "EMP_INSARISING":
        this.router.navigate(["/hrms/profile/business/insarising"]);
        break;
      default:
        break;

    }
  }
}
