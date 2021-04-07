import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { ForgotPasswordService } from '../../../shared/services/forgot-password.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  form: FormGroup;
  status = true;
  email: string;

  load = false;
  message: Message[];
  verify;
  statusResend = false;
  statusUpdate = true;

  typeInput = 'password';
  typeInputConf = 'password';

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: [null],
        password: [null, [Validators.required, Validators.minLength(6)]],
        conf_password: [null, [Validators.required]],
      },
      {
        validator: FormValidations.passwordMatchValidator,
      }
    );

    const { email, code } = this.activatedRoute.snapshot.queryParams;
    if (!email || !code) {
      this.router.navigate(['/login']);
    }

    this.forgotPasswordService.userForgotVerify(email, code).subscribe(
      (response) => {
        if (response.status === true) {
          this.form.patchValue({
            email: email,
          });
        }
      },
      (error) => {
        this.status = false;
        this.verify = error.error.data;
        this.email = email;
        if (this.verify.state === 'invalidToken') {
          this.message = [
            {
              severity: 'warn',
              summary: 'Alerta',
              detail: `O link de confirmação está expirado, para receber um novo clique no botão abaixo!`,
            },
          ];
        } else if (this.verify.state === 'invalidEmail') {
          this.message = [
            {
              severity: 'error',
              summary: 'Erro',
              detail: `O e-mail ${email} é inválido!`,
            },
          ];
        } else {
          this.message = [
            {
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao realizar verificação, tente novamente mais tarde!`,
            },
          ];
        }
      }
    );
  }

  applyInputError(input) {
    return {
      'ng-invalid ng-dirty': this.verifyValidTouched(input),
    };
  }

  verifyValidTouched(input: string) {
    return (
      !this.form.get(input).valid &&
      (this.form.get(input).touched || this.form.get(input).dirty)
    );
  }

  submit() {
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }

    const values = this.form.value;

    this.load = true;
    this.forgotPasswordService.newPassword(values).subscribe(
      (response) => {
        this.load = false;
        if (response.status === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Senha tualizada!',
          });
          this.status = response.status;
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.load = false;
        this.statusUpdate = false;
        this.message = [
          {
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao atualizar senha, tente novamente mais tarde`,
          },
        ];
      }
    );
  }

  resend() {
    this.load = true;
    this.forgotPasswordService.forgotPasswordResend(this.email).subscribe(
      (response) => {
        this.load = false;
        if (response.status === true) {
          this.statusResend = true;
          this.message = [
            {
              severity: 'success',
              summary: 'Sucesso',
              detail: `Foi enviado um e-mail de confirmação para o endereço de email ${this.email}.`,
            },
          ];
        }
      },
      (error) => {
        this.load = false;
        this.statusResend = true;
        this.message = [
          {
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao reenviar e-mail, tente novamente mais tarde`,
          },
        ];
      }
    );
  }

  viewPassword(value) {
    switch (value) {
      case 1:
        this.typeInput === 'password'
          ? (this.typeInput = 'text')
          : (this.typeInput = 'password');
        break;
      case 2:
        this.typeInputConf === 'password'
          ? (this.typeInputConf = 'text')
          : (this.typeInputConf = 'password');
        break;
    }
  }
}
