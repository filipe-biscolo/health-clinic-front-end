import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { ProcedureService } from '../../../shared/services/procedure.service';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss'],
})
export class ProceduresComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  procedures: any[];

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Procedimentos' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  msgs: Message[] = [];

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  constructor(
    private procedureService: ProcedureService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'duration', header: 'Duração' }
    ];

    this.listProcedures();

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  listProcedures() {
    this.procedureService.getProcedures(this.idClinic, this.page, this.rows).subscribe(
      (response) => {
        this.procedures = response.procedures;
        this.procedures.map(proc => proc.duration = `${proc.duration} minutos`);
        this.totalRecords = response.totalCount;
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

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listProcedures();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listProcedures();
  }

  editProcedure(id: string) {
    this.router.navigate(['/procedures', 'edit', id]);
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o procedimento?',
      header: 'Excluir procedimento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteProcedure(id);
      },
      reject: () => {},
    });
  }

  deleteProcedure(id: string) {
    this.procedureService.deleteProcedure(id).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Procedimento excluido com sucesso!',
        });
        this.refresh();
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exluir procedimento',
        });
      }
    );
  }

  exportPdf() {
    FormUtils.exportPdf('procedures', this.exportColumns, this.procedures);
  }

  exportExcel() {
    FormUtils.exportExcel('procedures', this.procedures);
  }

}
