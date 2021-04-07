import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../functions/form-validations';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent implements OnInit {
  @Input() control: FormControl;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {}

  get errorMessage(){
    for(const propertyName in this.control.errors){
      if(this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }

}
