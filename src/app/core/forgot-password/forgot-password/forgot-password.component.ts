import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { ForgotPasswordService } from '../../../shared/services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  emailSubmited = false;
  emailRegistered = false;

  load = false;
  message: Message[];

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]]
		});
  }

  applyInputError(input) {
    return {
      'ng-invalid ng-dirty': this.verifyValidTouched(input)
    };
  }

  verifyValidTouched(input: string) {
    return !this.form.get(input).valid && (this.form.get(input).touched || this.form.get(input).dirty);
  }

  submit(){
    if(!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }

    const values = this.form.value;
    this.load = true;
    this.forgotPasswordService.forgotPassword(values).subscribe(
      response => {
        this.load = false;
        if(response.status === true) {
          this.emailSubmited = true;
          this.message = [{severity:'success', summary: 'Sucesso', detail: `Foi enviado um e-mail de alteração de senha para o endereço de email ${response.data.email}.`}];
        }
      },
      error => {
        this.load = false;
        this.emailSubmited = true;
        if(error.status === 409) {
          this.message = [{severity:'warn', summary: 'Alerta', detail: `Já foi requisitada a alteração de senha, caso deseje pode ser feito o reenvio do e-mail pelo botão abaixo!`}];
          this.emailRegistered = true;
        } else {
          this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao requisitar recuperação de senha e-mail, tente novamente mais tarde`}];
        }
      });
  }

  resend(){
    this.load = true;
    this.forgotPasswordService.forgotPasswordResend(this.form.get('email').value).subscribe(
      response => {
        this.load = false;
        if(response.status === true){
          this.emailRegistered = false;
          this.message = [{severity:'success', summary: 'Sucesso', detail: `Foi enviado um e-mail de alteração de senha para o endereço de email ${response.data.email}.`}];
        }
      },
      error => {
        this.load = false;
        this.emailRegistered = false;
        this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao reenviar e-mail, tente novamente mais tarde`}];
      }
    );
  }

}
