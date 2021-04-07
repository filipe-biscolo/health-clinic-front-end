import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { ProcedureService } from '../../../shared/services/procedure.service';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Procedimentos', routerLink: '/procedures' }, { label: 'Novo procedimento' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };
  titlePage = 'Novo procedimento';
  durationMask = '0999';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private procedureService: ProcedureService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      name: [null, [Validators.required, Validators.maxLength(150)]],
      duration: [15, [Validators.required]],
    });

    const id = this.activatedRoute.snapshot.params.id as string;
    if (!!id) {
      this.procedureService.getProcedureById(this.idClinic, id).subscribe(
        (occupation) => {
          this.titlePage = 'Editar procedimento';
          this.items = [{ label: 'Procedimentos', routerLink: '/procedures' }, { label: 'Editar procedimento' }];
          this.form.patchValue({
            ...occupation,
          });
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar procedimento'});
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/procedures']);
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
      this.procedureService.putProcedure(values).subscribe(
        (response) => {
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Procedimento atualizado!' });
          this.router.navigate(['/procedures']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar procedimento'});
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.procedureService.postProcedure(values).subscribe(
        (response) => {
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Procedimento criado!' });
          this.router.navigate(['/procedures']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao criar procedimento'});
        }
      );
    }
  }
}
