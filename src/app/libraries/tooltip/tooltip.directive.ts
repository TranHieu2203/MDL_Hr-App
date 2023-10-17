import {
  Directive,
  Input,
  ComponentRef,
  ElementRef,
  ApplicationRef,
  EmbeddedViewRef,
  HostListener,
  ComponentFactoryResolver,
  Injector
} from '@angular/core';

import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  private componentRef!: ComponentRef<any>;
  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) { }

  @Input() appTooltip!: string;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.componentRef === undefined) {
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          TooltipComponent);
      this.componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.componentRef.hostView);
      const domElem =
        (this.componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
      this.setTooltipComponentProperties();

    }
  }
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  @HostListener('click')
  onClick(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== undefined) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = undefined as any;
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== undefined) {
      this.componentRef.instance.tooltip = this.appTooltip;
      const { left, right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
      this.componentRef.instance.left = (right - left) / 2 + left;
      this.componentRef.instance.top = bottom;
    }
  }

}
