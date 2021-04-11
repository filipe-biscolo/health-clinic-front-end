import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { City, State } from 'src/app/shared/model/model.barrel';
import { AddressService } from 'src/app/shared/services/address.service';
import { ClinicService } from '../../shared/services/clinic.service';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit {
  private idClinic;
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Minha clínica' }];
  home: MenuItem;
  titlePage = 'Editar clínica';

  arrStates: State[];
  arrCities: City[];

  phoneMask = '(00) 0000-00009';

  load = false;
  loadForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private clinicService: ClinicService,
    private addressService: AddressService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home' };

    this.form = this.formBuilder.group({
      id: [null],
      company_name: [null, [Validators.required, Validators.maxLength(200)]],
      fantasy_name: [null, [Validators.required, Validators.maxLength(200)]],
      cnpj: [null, [Validators.required, FormValidations.cnpjValidator]],
      street: [null, [Validators.required]],
      district: [null, [Validators.required]],
      address_number: [null, [Validators.required]],
      city_id: [null, [Validators.required]],
      state_id: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });

    this.idClinic = this.activatedRoute.snapshot.params.id as string;
    if (!!this.idClinic) {
      this.loadForm = true;
      this.clinicService.getClinicById(this.idClinic).subscribe(
        (clinic) => {
          this.form.patchValue({
            ...clinic,
          });
          this.loadForm = false;
        },
        (error) => {
          this.loadForm = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar clínica'});
        }
      );
    }

    this.getStates();

    this.form.get('state_id').valueChanges
        .pipe(map(idState => idState > 0 ? idState : null ))
        .subscribe(response => this.getCities(response));

    this.form.get('phone').valueChanges
      .pipe(map(phone => phone && phone.length === 11 ? '(00) 00000-0009' : '(00) 0000-00009' ))
      .subscribe(response => this.phoneMask = response);
  }

  cancel() {
    this.router.navigate(['/']);
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

  verifyValidTouched(input: string) {
    return (
      !this.form.get(input).valid &&
      (this.form.get(input).touched || this.form.get(input).dirty)
    );
  }

  applyInputError(input) {
    return {
      'ng-invalid ng-dirty': this.verifyValidTouched(input),
    };
  }

  onSubmit() {
    
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }
    
    const values = this.form.value;
    this.load = true;
    this.clinicService.putClinic(values).subscribe(
      (response) => {
        this.clinicService.updateHeader();
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Clínica atualizada!' });
        this.router.navigate(['/']);
        this.load = false;
      },
      (error) => {
        this.load = false;
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar clínica'});
      }
    );
  }
}
