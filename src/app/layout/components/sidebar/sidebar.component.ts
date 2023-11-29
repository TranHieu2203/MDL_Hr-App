import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/_services/navigation.service";
declare var $: any;

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  navigation: any;
  _router: any;

  curentModule: any;
  curentGroup: any;
  curentItem: any;
  curentType: "item" | "group" | "collapsable" | "module" | undefined;
  curentText: any;
  listModule: any;
  listGroup: any;
  listItem: any;
  isLoad: boolean = true;
  urlLogo = "../../../assets/images/logo-header.jpg"
  urlLogoSmall = "../../../assets/images/logo-small.png"
  permission: any;

  /**
   * Constructor
   */
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {
    this._router = router;
    this.navigation = this.navigationService.getCurrentNavigation();
    this.listModule = this.navigationService.getCurrentNavigation();
    let navigationFull = this.navigationService.getCurrentNavigation();

    // let per: any = localStorage.getItem("permission");
    // let urlpermission: any[] = [];

    // this.permission = JSON.parse(per).map((item: any) => item.functionCode);
    // findChild(navigationFull, this.permission);
    // function findChild(array: any, permission: any) {
    //   for (let i = 0; i < array.length; i++) {
    //     if (array[i].type == "item") {
    //       let index = permission.indexOf(array[i].id);
    //       if (index == -1) {
    //         array[i].hasChild = false;
    //       } else {
    //         array[i].hasChild = true;
    //         urlpermission.push(array[i].url);
    //       }
    //     } else {
    //       findChild(array[i].children, permission);
    //       var hasChild = array[i].children.findIndex((c: any) => {
    //         return c.hasChild == true;
    //       });
    //       if (hasChild > -1) {
    //         array[i].hasChild = true;
    //       } else {
    //         array[i].hasChild = false;
    //       }
    //     }
    //   }
    // }
    // this.navigation = navigationFull;

    // if (this.isAdmin == false) {
    //   this.permission = JSON.parse(per).map((item: any) => item.functionCode);
    //   findChild(navigationFull, this.permission);
    //   function findChild(array: any, permission: any) {
    //     for (let i = 0; i < array.length; i++) {
    //       if (array[i].type == "item") {
    //         let index = permission.indexOf(array[i].id);
    //         if (index == -1) {
    //           array[i].hasChild = false;
    //         } else {
    //           array[i].hasChild = true;
    //           urlpermission.push(array[i].url);
    //         }
    //       } else {
    //         findChild(array[i].children, permission);
    //         var hasChild = array[i].children.findIndex((c: any) => {
    //           return c.hasChild == true;
    //         });
    //         if (hasChild > -1) {
    //           array[i].hasChild = true;
    //         } else {
    //           array[i].hasChild = false;
    //         }
    //       }
    //     }
    //   }
    //   this.globals.urlPermission = urlpermission;
    // }
    // this.navigation = navigationFull;
  }

  ngOnInit(): void {
    if (this._router.url.indexOf('/hrms/dashboard') === 0) return;
    this.curentModule = localStorage.getItem("curentModule");
    if (this.curentModule) {
      this.listGroup = this.navigation.find((x: any) => x.id === this.curentModule)?.children;
      this.curentType = "group";
    }
    this.curentGroup = localStorage.getItem("curentGroup");
    if (this.curentGroup) {
      this.listItem = this.listGroup.find((x: any) => x.id === this.curentGroup)?.children;
      this.curentType = "item";
    }
    this.curentItem = localStorage.getItem("curentItem");
    this.curentText = localStorage.getItem("curentText");
  }
  choseModule(moduleId: any) {
    this.curentType = "group";
    this.curentModule = moduleId;
    this.curentText = this.navigation.find((x: any) => x.id === moduleId)?.title;
    this.listGroup = this.navigation.find((x: any) => x.id === moduleId)?.children;
    localStorage.setItem("curentModule", moduleId);
    localStorage.setItem("curentText", this.curentText);
    localStorage.setItem("curentType", this.curentType);
  }
  choseGroup(groupId: any) {
    this.curentType = "item";
    this.curentGroup = groupId;
    this.listItem = this.listGroup.find((x: any) => x.id === groupId)?.children;
    this.curentText = this.listGroup.find((x: any) => x.id === groupId)?.title;
    localStorage.setItem("curentGroup", groupId);
    localStorage.setItem("curentText", this.curentText);
    localStorage.setItem("curentType", this.curentType);
  }
  choseItem(itemId: any) {
    this.curentType = "item";
    localStorage.setItem("curentItem", itemId);
  }
  radomFa() {
    let icon = "";
    $.ajax({
      url: 'https://fontawesome.bootstrapcheatsheets.com/',
      success: function (data: string) {
        let faTags = $(data).find('.fa-class');
        let rnd: number = Math.floor((Math.random() * 10000));
        while (rnd > faTags.length)
          rnd = Math.floor((Math.random() * 10000));
        icon = faTags[rnd - 1].innerHTML.replace(".", "")
      }
    });
    return icon;

  }
  menuBack() {
    this.listItem = null;
    if (this.curentType === "item") {
      this.curentType = "group"
      this.listGroup = this.navigation.find((x: any) => x.id === this.curentModule)?.children;
      this.curentText = this.navigation.find((x: any) => x.id === this.curentModule)?.title;
      localStorage.setItem("curentText", this.curentText);
      return;
    }
    if (this.curentType === "group") {
      this.curentType = "module";
      return;
    }
    if (this.curentType === "module") {

    }
  }
  clearAll() {
    // localStorage.getItem("curentModule");
    // localStorage.getItem("curentModule");
    // localStorage.getItem("curentModule");
    // localStorage.getItem("curentModule");
  }
  toggleSidebar() {
    $(".setcompact").toggleClass("is-compact")
  }
}
