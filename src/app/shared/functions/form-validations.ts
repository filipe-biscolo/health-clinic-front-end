import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 

export class FormValidations {
  static requiredMinCheckbox(min = 1) {
    const validator = (formArray: FormArray) => {
      //   const values = formArray.controls;
      //   let totalChecked = 0;
      //   for(let i = 0; i < values.length; i++) {
      //     if(values[i].value){
      //       totalChecked += 1;
      //     }
      //   }
      const totalChecked = formArray.controls
        .map(v => v.value)
        .reduce((total, current) => current ? total + current : total, 0);
      return totalChecked >= min ? null : { required: true };
    }
    return validator;
  }

  static cepValidator(control: FormControl) {
    const cep = control.value;
    if (cep && cep !== '') {
      const validacep = /^[0-9]{8}/;
      return validacep.test(cep) ? null : { cepInvalido: true };
    }
    return null;
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('conf_password').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('conf_password').setErrors({ passwordNotEquivalent: true });
    }
  }

  static passwordMatchValidatorProfessional(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('conf_password').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('conf_password').setErrors({ passwordNotEquivalent: true });
    }
  }

  static equalsTo(otherField: string) {
    const validator = (formControl: FormControl) => {
      if(otherField == null) {
        throw new Error('É necessário informar um campo.');
      }

      if(!formControl.root || !(<FormGroup>formControl.root).get(otherField)) {
        return null;
      }

      const field = (<FormGroup>formControl.root).get(otherField);
      if(!field) {
        throw new Error('É necessário informar um campo válido.');
      }

      if(field.value !== formControl.value) {
        return { equalsTo: otherField };
      }
      return null;
    };
    return validator;
  }

  static cpfValidator(control: AbstractControl) {
    const cpfValue = control.value;

    if(cpfValue && !cpf.isValid(cpfValue)){
      return { cpfInvalid: true };
    }

    return null;
  }

  static cnpjValidator(control: AbstractControl) {
    const cnpjValue = control.value;

    if(cnpjValue && !cnpj.isValid(cnpjValue)){
      return { cnpjInvalid: true };
    }

    return null;
  }

  static verifyValidationsForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach( input => {
      const control = formGroup.get(input);
      control.markAsDirty();
      control.markAsTouched();
      if(control instanceof FormGroup) {
        this.verifyValidationsForm(control)
      }
    });
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){
    const config = {
      'required': `${fieldName} é obrigatório.`,
      'minlength': `${fieldName} precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `${fieldName} precisa ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'email': `${fieldName} inválido.`,
      'cepInvalido': 'CEP inválido.',
      'cpfInvalid': 'CPF inválido.',
      'cnpjInvalid': 'CNPJ inválido.',
      'passwordNotEquivalent': 'A senha está diferente.'
    };

    return config[validatorName];
  }
}