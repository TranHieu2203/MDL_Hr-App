import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { HeaderService } from 'src/app/_services/header.service';
import { MenuService } from 'src/app/_services/menu.service';
import { Subscription } from 'rxjs';
import { IAppModule } from 'src/app/layout/components/toolbar/IAppModule';
import { IModule } from '../modules/modules.component';

const moduleRouterLink = [{ outlets: { ppMain: ['modules'] } }]

const colors: string[][] = [
  ['bg-red-gradiant-1', 'bg-red-gradiant-2', 'bg-red-gradiant-3', 'bg-red-gradiant-4'],
  ['bg-green-gradiant-1', 'bg-green-gradiant-2', 'bg-green-gradiant-3', 'bg-green-gradiant-4'],
  ['bg-yellow-gradiant-1', 'bg-yellow-gradiant-2', 'bg-yellow-gradiant-3', 'bg-yellow-gradiant-4'],
  ['bg-blue-gradiant-1', 'bg-blue-gradiant-2', 'bg-blue-gradiant-3', 'bg-blue-gradiant-4'],
  ['bg-red-gradiant-1', 'bg-red-gradiant-2', 'bg-red-gradiant-3', 'bg-red-gradiant-4'],
]
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('webButton', { static: true }) webButton!: ElementRef;
  @ViewChild('mobButton', { static: true }) mobButton!: ElementRef;

  isOpen: boolean = false;
  isNoti: boolean = false;

  moduleRouterLink!: any[];
  randomAvatarSrc: string = '';

  navClass?: string;
  buttonClass?: string;
  searchClass = `${this.headerService.searchActive ? " show" : ""}`
  notiClass = `${this.isNoti ? " show" : ""}`

  keyword: string = this.headerService.keyword;
  searchActive: boolean = this.headerService.searchActive;

  avatar!: string;

  module!: IAppModule | null;
  children!: any[];
  activeModule!: IModule;

  modulesServiceActiveModuleSubscription!: Subscription;
  menuServiceIsOpenSubscription!: Subscription;

  toggleActive(): void {
    this.headerService.searchActive = !this.headerService.searchActive;
  }

  toggleOpen(): void {
    this.menuService.toogleOpen();
  }

  handleLogout(): void {

  }

  toggleIsNoti(): void {
    this.isNoti = !this.isNoti;
  }

  handleCloseHeader(): void {
    this.headerService.searchActive = false;
  }

  bgClass(columIndex: number, index: number): string {
    return colors[columIndex][index % 4];
  }

  handleChangePassword() {

  }

  constructor(
    private menuService: MenuService,
    private headerService: HeaderService,
  ) { }

  ngOnInit(): void {
    this.moduleRouterLink = moduleRouterLink;
    this.menuServiceIsOpenSubscription =
      this.menuService.isOpen.subscribe((value: boolean) => {
        this.isOpen = value;
        this.buttonClass = value ? " active" : "";
        this.navClass = value ? " nav-active" : "";
      });
    this.menuService.navigation.subscribe((x: any) => {
      if (!!x.length) {
        this.module = x[0];
        this.children = x[0].children;
      } else {
        this.module = null;
        this.children = [];
      }
    })
  }

  ngOnDestroy(): void {
    this.menuServiceIsOpenSubscription.unsubscribe();
  }

}