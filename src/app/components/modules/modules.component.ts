import { Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ModulesService } from 'src/app/_services/modules.service';
import { NavigationService } from 'src/app/_services/navigation.service';

export interface IFeature {
  code: string,
  tooltip: string,
  component: any,
  iconClass: string,
  routerLink: string,
}
export interface IModule {
  index: number;
  code: string,
  businessModule: string,
  tooltip: string,
  routerLink: string,
  features: IFeature[],
}

const colors: string[][] = [
  ['bg-red-gradiant-1', 'bg-red-gradiant-2', 'bg-red-gradiant-3', 'bg-red-gradiant-4'],
  ['bg-green-gradiant-1', 'bg-green-gradiant-2', 'bg-green-gradiant-3', 'bg-green-gradiant-4'],
  ['bg-yellow-gradiant-1', 'bg-yellow-gradiant-2', 'bg-yellow-gradiant-3', 'bg-yellow-gradiant-4'],
  ['bg-blue-gradiant-1', 'bg-blue-gradiant-2', 'bg-blue-gradiant-3', 'bg-blue-gradiant-4'],
  ['bg-red-gradiant-1', 'bg-red-gradiant-2', 'bg-red-gradiant-3', 'bg-red-gradiant-4'],
]

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModulesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container', { static: true}) container!: ElementRef;

  listenerFn!: () => void;
  columnCount: number = 3;
  modules!: IModule[];
  moduleArr: IModule[][] = [];
  rendered: boolean = false;
  routerLink!: any;
  columnBsClass!: string;

  navigation: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private modulesService: ModulesService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit(): void {

    this.navigation = this.navigationService.getCurrentNavigation();

    const newModules: IModule[] = [];
    let newFeatures: IFeature[];

    this.navigation.map((x: any, index: number) => {
      newFeatures = [];
      x.children.map((child: any) => {
        newFeatures.push({
        code: child.translate,
        tooltip: child.title,
        component: undefined,
        iconClass: child.icon,
        routerLink: child.url,
        })
      })
      newModules.push({
        index: index,
        code: x.translate,
        businessModule: x.url.split('/')[2],
        tooltip: x.title,
        routerLink: x.url,
        features: newFeatures,
      })
    })

    this.modules = newModules;

    let newRow: IModule[] = [];
    this.modules.map((m, index) => {
      if (index % this.columnCount === 0) {
        newRow = [];
      }
      newRow.push(m);
      if (index % this.columnCount === this.columnCount - 1) {
        this.moduleArr.push(newRow);
        newRow = [];
      }
    })
    if (newRow.length) this.moduleArr.push(newRow);
    this.columnBsClass = "col-md-" + Math.floor(12/this.columnCount);
    setTimeout(() => this.modulesService.isOpen.next(true), 100); // to bypass window.click when openning
    
  }

  ngAfterViewInit(): void {

    this.listenerFn = this.renderer.listen('window', 'click', (e: Event) => {

      if (
        this.container && this.modulesService.isOpen.value
        && !this.container.nativeElement.contains(e.target)
      ) {
        this.toggleOpen();
      }
    })

    this.rendered = true;
  }

  ngOnDestroy(): void {
    if (this.listenerFn) this.listenerFn();
  }

  toggleOpen(): void {
    if (this.modulesService.isOpen.value) this.router.navigate([{ outlets: { ppMain: null } }]);
    this.modulesService.isOpen.next(false);
  }

  bgClass(columIndex: number, index: number): string {
    return colors[columIndex][index % this.columnCount];
  }

  moduleClick(m: IModule) {
    this.modulesService.activeModule.next(m);
    if (localStorage) {
      localStorage.setItem('activeModule', JSON.stringify(m.code))
    }
    this.router.navigateByUrl(m.routerLink);
    this.modulesService.isOpen.next(false);
  }

  featureClick(m: IModule, f: IFeature) {
    this.modulesService.activeModule.next(m);
    if (localStorage) {
      localStorage.setItem('activeModule', JSON.stringify(m.code))
      localStorage.setItem('activeFeature', JSON.stringify(f.code))
    }
    this.router.navigateByUrl(m.routerLink + '/' + f.routerLink);
    this.modulesService.isOpen.next(false);
  }

}
