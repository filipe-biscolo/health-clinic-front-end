import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/login.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: SocialUser;
  loggedIn: boolean;

  form: FormGroup;
  load = false;
  loadSocial = false;

  message: Message[];
  errorType = '';

  unsubSocial: Subscription;

  typeInput = "password"

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private authService: SocialAuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(){
    this.unsubSocial && this.unsubSocial.unsubscribe();
  }

  submit(): void {
    console.log(this.form.value);
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }
    const values = this.form.value;
    this.load = true;
    this.loginService.signIn(values).subscribe(
      (response) => {
        this.load = false;
        this.router.navigate(['/loading']);
        this.messageService.add({
          severity: 'success',
          detail: 'Bem vindo ao Health Clinic!',
        });
      },
      (error) => {
        this.load = false;
        this.errorType = 'email';
        if (error.status === 401) {
          this.message = [{severity:'error', summary: 'Erro', detail: `E-mail inválido!`}];
        } else if (error.status === 403) {
          this.message = [{severity:'error', summary: 'Erro', detail: `Senha incorreta!`}];
        } else {
          this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao se autenticar!`}];
        }
      }
    );
  }

  signInWithGoogle(): void {
    this.messageService.clear();
    this.unsubSocial && this.unsubSocial.unsubscribe();
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.unsubSocial = this.authService.authState.subscribe((user) => {
      if (user) {
        this.loadSocial = true;
        this.loginService.signInSocial(user).subscribe(
          (response) => {
            this.loadSocial = false;
            this.router.navigate(['/loading']);
            this.messageService.add({
              severity: 'success',
              detail: 'Bem vindo ao Health Clinic!',
            });
          },
          (error) => {
            console.log(error);
            this.loadSocial = false;
            this.errorType = 'social';
            this.authService.signOut(true);
            if (error.status === 401) {
              this.message = [{severity:'error', summary: 'Erro', detail: `Usuário não cadastrado no sistema!`}];
            } else {
              this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao se autenticar!`}];
            }
          }
        );
      }
    });
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

  viewPassword(){
    this.typeInput === "password" ? this.typeInput = "text" : this.typeInput = "password";
  }
}
