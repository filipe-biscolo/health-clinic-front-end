import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { ProcedureService } from 'src/app/shared/services/procedure.service';
import { ProfessionalService } from 'src/app/shared/services/professional.service';
import { ScheduleService } from 'src/app/shared/services/schedule.service';
import { Permissions } from './../../../shared/enums/permissions';
import { SchedulingStatus } from '../../../shared/enums/scheduling';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public idClinic = this.loginService.getIdClinic();
  public headerIdProfessional = this.loginService.getIdProfessional();
  public permissions = this.loginService.getPermissions();
  public admin = this.loginService.getAdmin();

  schedule: any[];
  listPermissions = Permissions;
  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Agenda' }];
  home: MenuItem = { icon: 'pi pi-home' };
  searchProfessionals: any[] = [];
  professionals: any[];
  procedures: any[];

  schedulingStatus = SchedulingStatus;

  visibleScheduling = false;

  idScheduling = '';

  dateStart = null;
  dateEnd = null;
  idProfessional = null;

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  load = false;
  loadExport = false;

  constructor(
    private scheduleService: ScheduleService,
    private loginService: LoginService,
    private professionalService: ProfessionalService,
    private procedureService: ProcedureService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.dateStart = this.dateNowHTML();
    this.dateEnd = this.dateNowHTML();
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'date_hour', header: 'Data & Hora' },
      { field: 'patient_name', header: 'Paciente' },
      { field: 'professional_name', header: 'Profissional' },
      { field: 'procedure_name', header: 'Procedimento' },
      { field: 'scheduling_status', header: 'Status' },
    ];

    this.getProfessionals();
    this.getProcedures();

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  dateNowHTML(){
    let dateTimeNow = new Date();
    dateTimeNow.setMinutes(dateTimeNow.getMinutes() - dateTimeNow.getTimezoneOffset());
    return dateTimeNow.toISOString().slice(0,10);
  }

  getProfessionals() {
    this.professionalService.getProfessionalsSchedule(this.idClinic).subscribe(
      (response) => {
        this.professionals = response;
        this.professionals.forEach(professional => this.searchProfessionals.push(professional));
        this.searchProfessionals.unshift({id: '', name: 'Todos'});

        if(this.permissions === this.listPermissions.SE){
          this.idProfessional = this.searchProfessionals[0].id;
        } else if(this.permissions === this.listPermissions.HP) {
          this.searchProfessionals.forEach(professional => {
            if(professional.id === this.headerIdProfessional){
              this.idProfessional = professional.id;
            }
          });
        }

        this.listSchedule();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getProcedures() {
    this.procedureService.getProceduresAll(this.idClinic).subscribe(
      (response) => {
        this.procedures = response;
        this.procedures.map(procedure => {
          procedure.label = `${procedure.name} (${procedure.duration} min.)`
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar procedimentos',
        });
      }
    );
  }

  listSchedule() {
    this.load = true;
    this.scheduleService
      .getSchedule(this.idClinic, this.page, this.rows, this.idProfessional, this.dateStart, this.dateEnd)
      .subscribe(
        (response) => {
          this.schedule = response.schedule;
          this.totalRecords = response.totalCount;
          this.load = false;
        },
        (error) => {
          this.load = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar agenda',
          });
        }
      );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listSchedule();
  }

  refresh() {
    this.first = 0;
    this.page = 0;
    this.listSchedule();
  }

  search(){
    !this.dateStart && (this.dateStart = this.dateNowHTML());
    !this.dateEnd && (this.dateEnd = this.dateNowHTML());
    this.dateStart > this.dateEnd && (this.dateStart = this.dateEnd);
    this.refresh();
  }

  editScheduling(id: string) {
    this.idScheduling = id;
    this.showScheduling();
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o agendamento?',
      header: 'Excluir agendamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteScheduling(id);
      },
      reject: () => {},
    });
  }

  deleteScheduling(id: string) {
    this.scheduleService.deleteScheduling(id).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Agendamento excluido com sucesso!',
        });
        this.refresh();
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exluir agendamento',
        });
      }
    );
  }

  showScheduling() {
    this.visibleScheduling = true;
  }

  closeScheduling(e) {
    this.idScheduling = null;
    this.visibleScheduling = false;
    if (e === 'REFRESH') {
      this.refresh();
    }
  }

  startAttendance(e) {
    const idScheduling = e;
    this.router.navigate(['/attendances/new', idScheduling]);
  }

  exportExcel() {
    this.loadExport = true;
    this.scheduleService
    .getScheduleExport(this.idClinic, this.idProfessional, this.dateStart, this.dateEnd)
    .subscribe(
      (response) => {
        FormUtils.exportExcel('schedule', response);
        this.loadExport = false;
      },
      (error) => {
        this.loadExport = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar agendamentos',
        });
      }
    );

    
  }
}
