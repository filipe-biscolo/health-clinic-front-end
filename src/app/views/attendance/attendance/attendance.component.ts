import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { ScheduleService } from '../../../shared/services/schedule.service';

import * as arrAttendance from '../../../shared/arrays/attendance';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { AttendanceService } from '../../../shared/services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  form: FormGroup;

  items: MenuItem[] = [{ label: 'Atendimento' }];
  home: MenuItem;
  titlePage = 'Atendimento';
  scheduling: any;

  blood_types = arrAttendance.BloodType;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private scheduleService: ScheduleService,
    private attendanceService: AttendanceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
  ) { }

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
    });

    const {idScheduling, idAttendance } = this.activatedRoute.snapshot.params;
    console.log('this.activatedRoute.snapshot.params', this.activatedRoute.snapshot.params)
    if (!!idScheduling) {
      this.scheduleService.getSchedulingDetailById(this.idClinic, idScheduling).subscribe(
        (scheduling) => {
          this.scheduling = scheduling;
          this.form.get('scheduling').setValue(this.scheduling);
          this.form.get('clinic_id').setValue(this.scheduling.clinic_id);
        },
        (error) => {
          console.log('Error', error);
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar dados do agendamento'});
        }
      );
    }
  }

  cancel() {
    this.router.navigate(['/schedule']);
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
console.log('values', values)
    if(values.id) {
      this.attendanceService.putAttendance(values).subscribe(
        (response) => {
          console.log('Sucesso', response);
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Atendimento atualizado!' });
          this.router.navigate(['/health-insurances']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao atualizar atendimento'});
        }
      );
    } else {
      values.clinic_id = this.idClinic;
      this.attendanceService.postAttendance(values).subscribe(
        (response) => {
          this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Atendimento finalizado!' });
          this.router.navigate(['/health-insurances']);
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao finalizar atendimento'});
        }
      );
    }
  }
}
