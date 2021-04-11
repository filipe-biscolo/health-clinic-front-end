import { LoginService } from '../../../shared/services/login.service';
import { AddressService } from './../../../shared/services/address.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { City, State } from 'src/app/shared/model/address';
import { map } from 'rxjs/operators';
import { PatientService } from '../../../shared/services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormValidations } from 'src/app/shared/functions/form-validations';

import * as arrPerson from '../../../shared/arrays/person';
import { HealthInsuranceService } from '../../../shared/services/health-insurance.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;
  
  items: MenuItem[] = [ { label: 'Pacientes' }, { label: 'Novo paciente' } ];
  home: MenuItem;

  arrStates: State[];
  arrCities: City[];

  titlePage = 'Novo paciente';

  sex = arrPerson.Sex;
  marital_status = arrPerson.MaritalStatus;
  healthInsurances: any[];

  phoneMask = '(00) 0000-00009';
  phoneMaskAux = '(00) 0000-00009';

  load = false;
  loadForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private patientService: PatientService,
    private addressService: AddressService,
    private healthInsuranceService: HealthInsuranceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home' };

    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      sus_number: [null, [Validators.maxLength(20)]],
      health_insurance_id: [null],
      note: [null],
      email: [null, [Validators.email]],
      person: this.formBuilder.group({
        cpf: [null, [FormValidations.cpfValidator]],
        rg: [null, [Validators.maxLength(20)]],
        name: [null, [Validators.required, Validators.maxLength(200)]],
        phone: [null, [Validators.required]],
        phone_aux: [null],
        
        birth_date: [null],
        sex: [null],
        marital_status: [null],
        
        street: [null],
        district: [null],
        address_number: [null],
        city_id: [null],
        state_id: [null],
        cep: [null]
      }),
    });
    this.form.get('person.birth_date').setValue('2000-01-01');

    const id = this.activatedRoute.snapshot.params.id as string;
		if (!!id) {
      this.loadForm = true;
			this.patientService.getPatientById(this.idClinic, id).subscribe(
				patient => {
          this.titlePage = 'Editar paciente';
          this.items = [ { label: 'Pacientes' }, { label: 'Editar paciente' } ]
					this.form.patchValue({
						...patient
					});
          this.loadForm = false;
				},
				error => {
          this.loadForm = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar paciente'});
				}
			);
		}

    this.getStates();
    this.getHI();

    this.form.get('person.state_id').valueChanges
        .pipe(map(idState => idState > 0 ? idState : null ))
        .subscribe(response => this.getCities(response));

    this.form.get('person.phone').valueChanges
      .pipe(map(phone => phone && phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
      .subscribe(response => this.phoneMask = response);

    this.form.get('person.phone_aux').valueChanges
      .pipe(map(phone => phone && phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
      .subscribe(response => this.phoneMaskAux = response);
    
    }

  verifyValidTouched(input: string) {
    return !this.form.get(input).valid && (this.form.get(input).touched || this.form.get(input).dirty);
  }

  applyInputError(input) {
    return {
      'ng-invalid ng-dirty': this.verifyValidTouched(input)
    };
  }

  onSubmit() {
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }

    const values = this.form.value;
    this.load = true;
    if(values.id) {
      this.patientService.putPatient(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Paciente atualizado!' });
          this.router.navigate(['/patients']);
        },
        (error) => {
          this.load = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar paciente'});
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.patientService.postPatient(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Paciente criado!' });
          this.router.navigate(['/patients']);
        },
        (error) => {
          this.load = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao criar paciente'});
        }
      );
    }
  }

  getHI() {
    this.healthInsuranceService.getHealthInsurancesAll(this.idClinic).subscribe(
      response => {
        this.healthInsurances = response;
      },
      error => { console.error(error); }
    )
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

  cancel() {
    this.router.navigate(['/patients']);
  }

}
