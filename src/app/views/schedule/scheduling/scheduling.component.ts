import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormValidations } from 'src/app/shared/functions/form-validations';
import { HealthInsuranceService } from '../../../shared/services/health-insurance.service';
import { PatientService } from '../../../shared/services/patient.service';
import { ScheduleService } from '../../../shared/services/schedule.service';
import { Permissions } from '../../../shared/enums/permissions';
import { SchedulingStatus, SchedulingStatusDesc, ResponseScheduling } from '../../../shared/enums/scheduling';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/services/login.service';

enum StatesModal {
    VIEW = "VIEW",
    EDIT = "EDIT"
}

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss'],
})
export class SchedulingComponent implements OnInit, OnChanges {
  @Input() visible: boolean;
  @Input() idClinic: string;
  @Input() idScheduling: string;
  @Input() professionals: any[];
  @Input() procedures: any[];
  @Output() closeScheduling = new EventEmitter();

  public headerIdProfessional = this.loginService.getIdProfessional();
  public permissions = this.loginService.getPermissions();
  public admin = this.loginService.getAdmin();

  form: FormGroup;
  titleModal = 'Novo agendamento';

  schedulingStatus = SchedulingStatus;
  patients: any[];
  healthInsurances: any[];
  filteredHealthInsurances: any[];

  statesModal = StatesModal;
  stateModal: string;

  width = '60vw';
  height = 'auto';

  load = false;
  loadConfirm = false;
  loadCancel = false;
  loadForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private healthInsuranceService: HealthInsuranceService,
    private patientService: PatientService,
    private messageService: MessageService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.form.get('professional_id').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(response => {
        this.searchHIProfessionals(response);
      });

    this.form.get('patient_id').valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(response => {
        if(response && this.form.status !== "DISABLED") {
          const patient = this.patients.find(patient => patient.id === response);
          if(patient.health_insurance_id && this.filteredHealthInsurances && this.filteredHealthInsurances.length > 0) {
            this.form.get('has_health_insurance').setValue(true);
            this.form.get('health_insurance_id').setValue(patient.health_insurance_id);
          }
        }
      });
    
    this.form.get('has_health_insurance').valueChanges
      .subscribe(response => {
        if(response === true){
          this.form.get('health_insurance_id').enable();
        } else {
          this.form.get('health_insurance_id').disable();
          this.form.get('health_insurance_id').setValue(null);
        }
      });

      const mq = window.matchMedia('(max-width: 40rem)');
      if(mq.matches){
        this.width = '100vw';
      }
  }

  searchHIProfessionals(idProfessional){
    if(idProfessional && this.professionals){
      this.filteredHealthInsurances = [];
      const professional = this.professionals.find(p => p.id === idProfessional);
      this.healthInsurances.forEach(hi => {
        const exist = professional.health_insurances.find(item => item.health_insurance_id === hi.id);
        if(exist){
          this.filteredHealthInsurances.push(hi);
        }
      });
      if(idProfessional && this.form.status !== "DISABLED") {
        if(!this.filteredHealthInsurances || this.filteredHealthInsurances.length <= 0){
          this.form.get('has_health_insurance').setValue(false);
          this.form.get('has_health_insurance').disable();
        } else {
          this.form.get('has_health_insurance').enable();
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const mq = window.matchMedia('(max-width: 40rem)');
    if(mq.matches){
      this.width = '100vw';
    } else {
      this.width = '50vw';
    }
  }

  initForm(){
    let dateTimeNow = this.dateNowHTML();
    this.form = this.formBuilder.group({
      id: [null],
      clinic_id: [null],
      patient_id: [null, [Validators.required]],
      professional_id: [null, [Validators.required]],
      procedure_id: [null, [Validators.required]],
      health_insurance_id: [null],
      has_health_insurance: [false],
      scheduling_status: [null, [Validators.required]],
      date_hour: [null],
      date_hour_end: [null],
      date: [dateTimeNow.substr(0,10), [Validators.required]],
      hour: [dateTimeNow.substr(11,16), [Validators.required]],
    });
    
    this.defaultState();
  }

  defaultState(){
    this.form.get('scheduling_status').setValue(this.schedulingStatus.SCHEDULED);
    this.form.get('has_health_insurance').setValue(false);
    this.form.get('health_insurance_id').disable();

    if(this.permissions === Permissions.HP){
      !this.admin && this.form.get('professional_id').disable();
      this.form.get('professional_id').setValue(this.headerIdProfessional);
    }
  }

  dateNowHTML(dateForm?){
    let dateTimeNow = dateForm ? new Date(dateForm) : new Date();
    dateTimeNow.setMinutes(dateTimeNow.getMinutes() - dateTimeNow.getTimezoneOffset());
    return dateTimeNow.toISOString().slice(0,16);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (changes.hasOwnProperty(change)) {
        if(change === 'idClinic' && this.idClinic){
          this.getPatients();
          this.getHI();
          
        }
        if(change === 'idScheduling' && this.idScheduling){
          this.loadForm = true;
          this.scheduleService.getSchedulingById(this.idClinic, this.idScheduling).subscribe(
            scheduling => {
              this.form.disable();
              this.stateModal = this.statesModal.VIEW;
              scheduling.date_hour = this.dateNowHTML(scheduling.date_hour);
              scheduling.date = this.dateNowHTML(scheduling.date_hour).substr(0,10);
              scheduling.hour = this.dateNowHTML(scheduling.date_hour).substr(11,16);

              this.form.patchValue({
                ...scheduling
              });
              this.form.get('health_insurance_id').disable();
              this.loadForm = false;
            },
            error => {
              this.loadForm = false;
              this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar profissional'});
            }
          );
        } else if(change === 'idScheduling' && !this.idScheduling && this.form?.value){
          this.titleModal = 'Novo agendamento';
        }
      }
    }
  }

  onShow(e) {
    if(!this.form.get('date_hour').value){
      this.form.get('date_hour').setValue(this.dateNowHTML());
      this.form.get('date').setValue(this.dateNowHTML().substr(0,10));
      this.form.get('hour').setValue(this.dateNowHTML().substr(11,16));
    }
    if(this.permissions === Permissions.HP){
      this.searchHIProfessionals(this.headerIdProfessional);
    }
    this.idScheduling && (this.titleModal = `Visualizar agendamento (${SchedulingStatusDesc[this.form.get('scheduling_status').value]})`);
  }

  onHide(e) {
    this.form.reset();
    this.form.status === "DISABLED" && this.form.enable();
    this.stateModal = null;
    this.defaultState();
  }

  getPatients() {
    this.patientService.getPatientsAll(this.idClinic).subscribe(
      (response) => {
        this.patients = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getHI() {
    this.healthInsuranceService.getHealthInsurancesAll(this.idClinic).subscribe(
      (response) => {
        this.healthInsurances = response;
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar conv??nios',
        });
      }
    );
  }

  close() {
    this.closeScheduling.emit(ResponseScheduling.DEFAULT);
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

  editScheduling(){
    this.form.enable();
    this.stateModal = this.statesModal.EDIT;
    this.titleModal = "Editar agendamento";

    if(this.permissions === Permissions.HP && !this.admin){
      this.form.get('professional_id').disable();
    }

    if(!this.filteredHealthInsurances || this.filteredHealthInsurances.length <= 0){
      this.form.get('has_health_insurance').disable();
      this.form.get('health_insurance_id').disable();
    } else {
      this.form.get('has_health_insurance').enable();
    }
  }

  dateTemplate(){
    const dateHour = `${this.form.get('date').value}T${this.form.get('hour').value}:01`;
    console.log('dateHour', dateHour)
    const procedure = this.procedures.find(proc => proc.id === this.form.get('procedure_id').value);
    
    let dateHourEnd: any = new Date(new Date(dateHour).getTime() + procedure.duration * 60000);
    dateHourEnd.setMinutes(dateHourEnd.getMinutes() - dateHourEnd.getTimezoneOffset());
    dateHourEnd = dateHourEnd.toISOString().slice(0,16);

    this.form.get('date_hour').setValue(dateHour);
    this.form.get('date_hour_end').setValue(dateHourEnd);
  }

  onSubmit() {
    if (!this.form.valid) {
      FormValidations.verifyValidationsForm(this.form);
      return;
    }
    
    this.dateTemplate();

    const values = this.form.getRawValue();
    this.load = true;
    if (values.id) {
      this.scheduleService.putScheduling(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Agendamento atualizado!',
          });
          this.closeScheduling.emit(ResponseScheduling.REFRESH);
        },
        (error) => {
          this.load = false;
          if(error.status === 409) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Alerta',
              detail: 'Hor??rio indispon??vel!',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar agendamento',
            });
          }
        }
      );
    } else {
      console.log('values', values);
      values.clinic_id = this.idClinic;
      this.scheduleService.postScheduling(values).subscribe(
        (response) => {
          this.load = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Agendamento criado!',
          });
          this.closeScheduling.emit(ResponseScheduling.REFRESH);
        },
        (error) => {
          this.load = false;
          if(error.status === 409) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Alerta',
              detail: 'Hor??rio indispon??vel!',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar agendamento',
            });
          }
        }
      );
    }
  }

  confirmScheduling(){
    this.form.get('scheduling_status').setValue(this.schedulingStatus.CONFIRMED);
    this.dateTemplate();
    const values = this.form.getRawValue();
    this.loadConfirm = true;
    this.scheduleService.putScheduling(values).subscribe(
      (response) => {
        this.loadConfirm = false;
        console.log('Sucesso', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Agendamento confirmado!',
        });
        this.closeScheduling.emit(ResponseScheduling.REFRESH);
      },
      (error) => {
        this.loadConfirm = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao confirmar agendamento',
        });
      }
    );
  }

  cancelScheduling(){
    this.form.get('scheduling_status').setValue(this.schedulingStatus.CANCELED);
    this.dateTemplate();
    const values = this.form.getRawValue();
    this.loadCancel = true;
    this.scheduleService.putScheduling(values).subscribe(
      (response) => {
        this.loadCancel = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Agendamento cancelado!',
        });
        this.closeScheduling.emit(ResponseScheduling.REFRESH);
      },
      (error) => {
        this.loadCancel = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cancelar agendamento',
        });
      }
    );
  }
}
