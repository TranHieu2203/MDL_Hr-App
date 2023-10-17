import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ScrollService {
  constructor(private router: Router) { }
  scrollToElementById(id: string) {
    const element = this.__getElementById(id);
    this.scrollToElement(element);
  }

  private __getElementById(id: string): HTMLElement {
    const element = document.getElementById(id)!;
    return element;
  }
  scrollToElement(element: HTMLElement) {
    element.scroll({ behavior: "smooth" });
  }
}
