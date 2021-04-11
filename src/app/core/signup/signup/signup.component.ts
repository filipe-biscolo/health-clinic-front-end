import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService } from '../../../shared/services/signup.service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  status = false;

  message: Message[];
  load = false;
  emailRegistered = false;

  unsubSocial: Subscription;

  constructor(
    private fb: FormBuilder,
    private signupService: SignupService,
    private authService: SocialAuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
			email: ['', [Validators.required, Validators.email]]
		});
  }

  ngOnDestroy(){
    this.unsubSocial && this.unsubSocial.unsubscribe();
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
    this.load = true;
    const values = this.form.value;
    this.signupService.queue(values).subscribe(
      response => {
        this.load = false;
        if(response.status === true) {
          this.message = [{severity:'success', summary: 'Sucesso', detail: `Foi enviado um e-mail de confirmação para o endereço de email ${response.data.email}.`}];
          this.status = true;
        }
      },
      error => {
        this.load = false;
        this.status = true;
        if(error.status === 409) {
          if(error.error.type === 'QUEUE') {
            this.message = [{severity:'warn', summary: 'Alerta', detail: `Você já se cadastrou com o e-mail ${values.email}, verifique seu e-mail para ativar sua conta!`}];
            this.emailRegistered = true;
          } else {
            this.message = [{severity:'warn', summary: 'Alerta', detail: `Já existe uma conta ativa com o e-mail ${values.email} cadastrado!`}];
          }
        } else {
          this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao cadastrar e-mail, tente novamente mais tarde`}];
        }
      }
    );
  }

  resend(){
    this.load = true;
    this.signupService.queueResend(this.form.get('email').value).subscribe(
      response => {
        if(response.status === true){
          this.load = false;
          this.emailRegistered = false;
          this.message = [{severity:'success', summary: 'Sucesso', detail: `Foi enviado um e-mail de confirmação para o endereço de email ${this.form.get('email').value}.`}];
        }
      },
      error => {
        this.load = false;
        this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao reenviar e-mail, tente novamente mais tarde`}];
      }
    )
  }

  submitSocial(): void {
    this.unsubSocial && this.unsubSocial.unsubscribe();
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.unsubSocial = this.authService.authState.subscribe((user) => {
      this.signupService.queueSocial(user)
      .subscribe(
        response => {
        const {email, code } = response.data;
        this.router.navigate(['/signup/form'], { queryParams: { email, code } });
      },
      error => {
        this.load = false;
        this.status = true;
        if(error.status === 409) {
          this.message = [{severity:'warn', summary: 'Alerta', detail: `Já existe uma conta ativa com o essa esse usuário Google!`}];
        } else {
          this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao cadastrar e-mail, tente novamente mais tarde`}];
        }
      });

    });
  }

}
