import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { ScheduleService } from '../../../shared/services/schedule.service';

import * as arrAttendance from '../../../shared/arrays/attendance';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { AttendanceService } from '../../../shared/services/attendance.service';

enum StatesForm {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Prontuário' }, { label: 'Atendimento' }];
  home: MenuItem;
  titlePage = 'Atendimento';
  scheduling: any;

  blood_types = arrAttendance.BloodType;

  statesForm = StatesForm;
  stateForm: string;

  load = false;
  loadForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private scheduleService: ScheduleService,
    private attendanceService: AttendanceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.home = { icon: 'pi pi-home' };

    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      weight: [null],
      blood_pressure: [null],
      blood_type: [null],
      allergies: [null],
      chronic_diseases: [null],
      note: [null],
      prescription: [null, [Validators.required]],
      scheduling: [null],
      created_at: [null],
    });

    const { idScheduling, idAttendance } = this.activatedRoute.snapshot.params;
    
    if (!!idScheduling) {
      this.loadForm = true;
      this.scheduleService
        .getSchedulingDetailById(this.idClinic, idScheduling)
        .subscribe(
          (scheduling) => {
            this.scheduling = scheduling;
            this.form.get('scheduling').setValue(this.scheduling);
            this.form.get('clinic_id').setValue(this.scheduling.clinic_id);
            this.loadForm = false;
          },
          (error) => {
            this.loadForm = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar dados do agendamento',
            });
          }
        );
    }
    if (!!idAttendance) {
      this.loadForm = true;
      this.attendanceService
        .getAttendanceById(this.idClinic, idAttendance)
        .subscribe(
          (attendance) => {
            this.scheduling = attendance.scheduling;
            this.items = [
              { label: 'Prontuário' },
              { label: 'Visualizar atendimento' },
            ];
            this.form.patchValue({
              ...attendance,
            });

            this.stateForm = this.statesForm.VIEW;
            this.form.disable();
            this.loadForm = false;
          },
          (error) => {
            this.loadForm = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao carregar dados do agendamento',
            });
          }
        );
    }
  }

  cancel() {
    if(!this.form.get('id').value) {
      this.router.navigate(['/schedule']);
    } else {
      this.router.navigate(['/attendances', this.scheduling.patient.id]);
    }
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

  editAttendance() {
    this.form.enable();
    this.stateForm = this.statesForm.EDIT;
    this.items = [{ label: 'Prontuário' }, { label: 'Editar atendimento' }];
  }

  onSubmit() {
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }

    const values = this.form.value;
    this.load = true;
    if (values.id) {
      this.attendanceService.putAttendance(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Atendimento atualizado!',
          });
          this.router.navigate(['/attendances', values.scheduling.patient.id]);
        },
        (error) => {
          this.load = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar atendimento',
          });
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.attendanceService.postAttendance(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Atendimento finalizado!',
          });
          this.router.navigate(['/schedule']);
        },
        (error) => {
          this.load = false;
          this.form.enable();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao finalizar atendimento',
          });
        }
      );
    }
  }
}
