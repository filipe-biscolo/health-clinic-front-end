import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { PatientService } from '../../../shared/services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  patients: any[];

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Pacientes' }];
  home: MenuItem = { icon: 'pi pi-home' };

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  constructor(
    private patientService: PatientService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
    ) {}

  ngOnInit() {
    this.listPatients();
    
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'sex', header: 'Sexo' },
      { field: 'birth_date', header: 'Idade' },
      { field: 'cpf', header: 'CPF' },
      { field: 'phone', header: 'Telefone' },
      { field: 'health_insurance_name', header: 'Convênio' },
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  listPatients() {
    this.patientService
      .getPatients(this.idClinic, this.page, this.rows)
      .subscribe(
        (response) => {
          this.patients = response.patients;
          this.totalRecords = response.totalCount;
        },
        (error) => {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar pacientes'});
        }
      );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listPatients();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listPatients();
  }

  editPatient(id: string) {
    console.log('id', id)
    this.router.navigate(['/patients', 'edit', id]);
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o paciente?',
      header: 'Excluir paciente',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deletePatient(id);
      },
      reject: () => {},
    });
  }

  deletePatient(id: string) {
    this.patientService.deletePatient(id).subscribe(
      (response) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Paciente excluido com sucesso!',
        });
        this.refresh();
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exluir paciente',
        });
      }
    );
  }
  
  exportPdf() {
    FormUtils.exportPdf('patients', this.exportColumns, this.patients);
  }

  exportExcel() {
    FormUtils.exportExcel('patients', this.patients);
  }
}
