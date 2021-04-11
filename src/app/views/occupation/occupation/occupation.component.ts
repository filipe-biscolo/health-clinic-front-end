import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { OccupationService } from '../../../shared/services/occupation.service';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss']
})
export class OccupationComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Cargos', routerLink: '/occupations' }, { label: 'Novo cargo' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };
  titlePage = 'Novo cargo';

  permissions = [
    { id: 'HP', label: 'Profissional da saúde' },
    { id: 'SE', label: 'Secretário' },
  ];

  load = false;
  loadForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private occupationService: OccupationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      name: [null, [Validators.required, Validators.maxLength(150)]],
      permissions: [null, [Validators.required]],
    });

    const id = this.activatedRoute.snapshot.params.id as string;
    if (!!id) {
      this.loadForm = true;
      this.occupationService.getOccupationById(this.idClinic, id).subscribe(
        (occupation) => {
          this.titlePage = 'Editar cargo';
          this.items = [{ label: 'Cargos', routerLink: '/occupations' }, { label: 'Editar cargo' }];
          this.form.patchValue({
            ...occupation,
          });
          this.loadForm = false;
        },
        (error) => {
          this.loadForm = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar cargo'});
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/occupations']);
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
    if(values.id) {
      this.occupationService.putOccupation(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cargo atualizado!' });
          this.router.navigate(['/occupations']);
        },
        (error) => {
          this.load = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar cargo'});
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.occupationService.postOccupation(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cargo criado!' });
          this.router.navigate(['/occupations']);
        },
        (error) => {
          this.load = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao criar cargo'});
        }
      );
    }
  }
}
