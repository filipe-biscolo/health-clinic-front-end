import { FormUtils } from 'src/app/shared/functions/form-utils';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { City, State } from 'src/app/shared/model/address';
import { AddressService } from 'src/app/shared/services/address.service';
import { SignupService } from '../../../shared/services/signup.service';

import * as arrPerson from '../../../shared/arrays/person';
import { Message, MessageService } from 'primeng/api';

enum StepForm {
  USER = "USER",
  CLININC = "CLINIC"
};

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  formUser: FormGroup;
  formClinic: FormGroup;
  errorSubmit = false;
  sex = arrPerson.Sex;

  phoneMask = '(00) 0000-00009';

  step = StepForm.USER;
  steps = StepForm;

  arrStates: State[];
  arrCities: City[];

  verify: any;
  status = true;
  email: string;
  statusResend = false;

  message: Message[];

  load = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private signupService: SignupService,
    private addressService: AddressService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
			email: [null],
			password: [null],
			conf_password: [null],
      person: this.formBuilder.group({
        cpf: [null, [Validators.required, FormValidations.cpfValidator]],
        name: [null, [Validators.required, Validators.maxLength(200)]],
        phone: [null, [Validators.required]],
        birth_date: [null, [Validators.required]],
        sex: [null, [Validators.required]]
      }),
      type: [null],
		});

    this.formUser = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      conf_password: [null, [Validators.required]]
    },
    {
       validator: FormValidations.passwordMatchValidator
    });

    this.formUser.get('email').disable();
    this.form.get('person.birth_date').setValue('2000-01-01');
    

    this.formClinic = this.formBuilder.group({
      id: [],
			company_name: [null, [Validators.required]],
			fantasy_name: [null, [Validators.required]],
			cnpj: [null, [Validators.required, FormValidations.cnpjValidator]],
			street: [null, [Validators.required]],
			district: [null, [Validators.required]],
			address_number: [null, [Validators.required]],
			city_id: [null, [Validators.required]],
			state_id: [null, [Validators.required]],
			cep: [null, [Validators.required]],
			phone: [null, [Validators.required]]
		});

    const { email, code } = this.activatedRoute.snapshot.queryParams;
    if(!email || !code){
      this.router.navigate(['/login']);
    }

    this.signupService.verifyUserQueue(email, code).subscribe(
      response => {
        this.verify = response;
        if(response.data?.state === 'userFound') {
          this.formClinic.get('id').setValue(response.data.clinic_id);
          this.step = this.steps.CLININC;
        }

        if(response.status === true && response.data.name){
          this.form.patchValue({
            email: email,
            person: {
              name: response.data.name
            },
            type: response.data.type
          });
          this.formUser.patchValue({
            email: email
          });
        } else {
          this.form.patchValue({
            email: email,
            type: response.data.type
          });
          this.formUser.patchValue({
            email: email
          });
        }
      },
      error => {
        this.verify = error.error.data;
        this.status = false;
        this.email = email;
        if(error.status === 409) {
          this.message = [{severity:'error', summary: 'Erro', detail: `Já existe uma conta ativa com o e-mail ${ email } cadastrado!`}];
        } else {
          if(this.verify.state === 'invalidToken'){
            this.message = [{severity:'warn', summary: 'Alerta', detail: `O link de confirmação está expirado, para receber um novo clique no botão abaixo!`}];
          } else if(this.verify.state === 'invalidEmail') {
            this.message = [{severity:'error', summary: 'Erro', detail: `O e-mail ${ email } é inválido!`}];
          } else {
            this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao realizar verificação, tente novamente mais tarde!`}];
          }
        }
        console.error(error);
      }
    );

    this.getStates();

    this.formClinic.get('state_id').valueChanges
        .pipe(map(idState => idState > 0 ? idState : null ))
        .subscribe(response => this.getCities(response));

    this.form.get('person.phone').valueChanges
    .pipe(map(phone => phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
    .subscribe(response => this.phoneMask = response);

    this.formClinic.get('phone').valueChanges
    .pipe(map(phone => phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
    .subscribe(response => this.phoneMask = response);
  }

  applyInputError(input) {
    return { 'ng-invalid ng-dirty': this.verifyValidTouched(input) };
  }
  verifyValidTouched(input: string) {
    return !this.form.get(input).valid && (this.form.get(input).touched || this.form.get(input).dirty);
  }

  verifyUserValidTouched(input: string) {
    return !this.formUser.get(input).valid && (this.formUser.get(input).touched || this.formUser.get(input).dirty);
  }
  applyUserInputError(input) {
    return {
      'ng-invalid ng-dirty': this.verifyUserValidTouched(input)
    };
  }

  applyInputErrorClinic(input) {
    return { 'ng-invalid ng-dirty': this.verifyValidTouchedClinic(input) };
  }
  verifyValidTouchedClinic(input: string) {
    return !this.formClinic.get(input).valid && (this.formClinic.get(input).touched || this.formClinic.get(input).dirty);
  }

  getStates() {
    this.addressService.getStates().subscribe(
        response => {
          this.arrStates = response;
        },
        error => console.error(error)
        );
  }

  getCities(idState: number) {
      this.addressService.getCitiesByStateId(idState).subscribe(
        response => {
          this.arrCities = response;
        },
        error => { console.error(error); }
      );
  }

  submit(){
    if(!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      this.form.get('type').value === 'mail' && FormValidations.verifyValidationsForm(this.formUser);
      return;
    }

    if (!this.formUser.valid && this.form.get('type').value === 'mail') {
      FormValidations.verifyValidationsForm(this.formUser);
      return;
    } 

    if(this.form.get('type').value === 'mail') {
      this.form.get('password').setValue(this.formUser.get('password').value);
      this.form.get('conf_password').setValue(this.formUser.get('conf_password').value);
    }
    
   const values = this.form.value;
    this.load = true;
    this.errorSubmit = false;
    this.signupService.signUp(values).subscribe(
      response => {
        if(response.status === true) {
          this.load = false;
          this.step = this.steps.CLININC;
          this.formClinic.get('id').setValue(response.data.professional.clinic_id);
        }
      },
      error => {
        this.load = false;
        this.errorSubmit = true;
        this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao realizar o cadastro de usuário!`}];
      }
    )
  }

  submitClinic(){
    if(!this.formClinic.valid) {
      FormValidations.verifyValidationsForm(this.formClinic);
      return;
    }

   const values = this.formClinic.value;
    this.load = true;
    this.signupService.updateClinic(values).subscribe(
      response => {
        this.load = false;
        if(response.status === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cadastro completo, faça o login para utilizar o sistema!',
          });
          this.router.navigate(['/login']);
        }
      },
      error => {
        this.load = false;
        this.errorSubmit = true;
        this.message = [{severity:'error', summary: 'Erro', detail: `Erro ao realizar o cadastro da clínica!`}];
      }
    );
  }


  resend(){
    this.load = true;
    this.signupService.queueResend(this.email).subscribe(
      response => {
        this.load = false;
        if(response.status === true){
          this.message = [{severity:'success', summary: 'Sucesso', detail: `Foi enviado um e-mail de confirmação para o endereço de email ${this.email}.`}];
          this.statusResend = true;
        }
      },
      error => { 
        this.load = false;
        console.error(error)
      }
    );
  }

}
