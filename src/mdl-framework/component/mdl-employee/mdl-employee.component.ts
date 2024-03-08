import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroupDirective, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mdl-employee',
  templateUrl: './mdl-employee.component.html',
  styleUrls: ['./mdl-employee.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdlEmployeeComponent),
      multi: true
    },
  ]

})
export class MdlEmployeeComponent implements ControlValueAccessor {

  // Input properties
  @Input() label: string = '';
  @Input() type: string = 'text'; // Default type
  @Input() placeholder: string = '';
  @Input() maxLength!: number;

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() requiredMessage: string = 'This field is required.';
  @Input() control: FormControl | null = null;

  // Output event for value changes
  @Output() onchange = new EventEmitter<any>();

  // Internal value
  innerValue: any;

  // ControlValueAccessor implementation
  private onChange = (_: any) => { };
  private onTouched = () => { };
  get formControl() {
    return this.control instanceof FormControl ? this.control : new FormControl('', this.getValidators());
  }

  getValidators() {
    const validators = [];
    if (this.required) {
      validators.push(Validators.required);
    }
    if (this.maxLength) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    return validators;
  }


  writeValue(value: any): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Update value on user input and emit change event
  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.innerValue = target.value;
    this.onChange(this.innerValue);
    this.onchange.emit(this.innerValue);
  }


}
