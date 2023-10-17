import { Component, ElementRef, Input, OnInit, OnDestroy } from "@angular/core";

import { ModalService } from "src/app/_services/modal.service";

@Component({
  selector: "modal-md",
  template: `
     <div class="modal-md">
    <div class="modal-header">
      <div>
        <p>{{this.title}} </p>
      </div>
      <div>
        <span><i class="fa fa-window-maximize me-3" aria-hidden="true"></i></span>
        <span class="pl-2" (click)="close()"><i class="fa fa-times" aria-hidden="true"></i></span>
      </div>
    </div>
    <div class="modal-content">
      <ng-content></ng-content>
    </div>
    <div class="modal-footer">
      {{this.footer}}
    </div>
   

  </div>
  <div class="modal-background"></div>
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() title!: string;
  @Input() footer!: string;
  @Input() params!: any;


  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    let modal = this;

    // ensure id attribute exists
    if (!this.id) {
      console.error("modal must have an id");
      return;
    }
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // open modal
  open(): void {
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
  }

  // close modal
  close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
  }

}
