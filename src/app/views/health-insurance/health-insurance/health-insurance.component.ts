import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { HealthInsuranceService } from '../../../shared/services/health-insurance.service';

@Component({
  selector: 'app-health-insurance',
  templateUrl: './health-insurance.component.html',
  styleUrls: ['./health-insurance.component.scss']
})
export class HealthInsuranceComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Convênios', routerLink: '/health-insurances' }, { label: 'Novo convênio' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };
  titlePage = 'Novo convênio';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private healthInsuranceService: HealthInsuranceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      name: [null, [Validators.required, Validators.maxLength(150)]],
    });

    const id = this.activatedRoute.snapshot.params.id as string;
    if (!!id) {
      this.healthInsuranceService.getHealthInsuranceById(this.idClinic, id).subscribe(
        (hi) => {
          this.titlePage = 'Editar convênio';
          this.items = [{ label: 'Convênios', routerLink: '/health-insurances' }, { label: 'Editar convênio' }];
          this.form.patchValue({
            ...hi,
          });
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar convênio'});
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/health-insurances']);
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

    if(values.id) {
      this.healthInsuranceService.putHealthInsurance(values).subscribe(
        (response) => {
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Convênio atualizado!' });
          this.router.navigate(['/health-insurances']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar convênio'});
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.healthInsuranceService.postHealthInsurance(values).subscribe(
        (response) => {
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Convênio criado!' });
          this.router.navigate(['/health-insurances']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao criar convênio'});
        }
      );
    }
  }

}
