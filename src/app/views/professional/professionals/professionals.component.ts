import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { ProfessionalService } from '../../../shared/services/professional.service';

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.scss']
})
export class ProfessionalsComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  public idProfessional = this.loginService.getIdProfessional();
  public admin = this.loginService.getAdmin();
  professionals: any[];

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Profissionais' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  constructor(
    private professionalService: ProfessionalService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'occupation_name', header: 'Cargo' },
      { field: 'email', header: 'E-mail' },
      { field: 'admin', header: 'Admin.' },
      { field: 'phone', header: 'Telefone' },
    ];

    this.listProfessionals();

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  listProfessionals() {
    this.professionalService
      .getProfessionals(this.idClinic, this.page, this.rows)
      .subscribe(
        (response) => {
          this.professionals = response.professionals;
          this.totalRecords = response.totalCount;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar profissionais',
          });
        }
      );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listProfessionals();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listProfessionals();
  }

  editProfessional(id: string) {
    this.router.navigate(['/professionals', 'edit', id]);
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o profissional?',
      header: 'Excluir profissional',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteProfessional(id);
      },
      reject: () => {},
    });
  }

  deleteProfessional(id: string) {
    this.professionalService.deleteProfessional(id).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Profissional excluido com sucesso!',
        });
        this.refresh();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exluir profissional',
        });
      }
    );
  }

  exportPdf() {
    FormUtils.exportPdf('professionals', this.exportColumns, this.professionals);
  }

  exportExcel() {
    FormUtils.exportExcel('professionals', this.professionals);
  }
}
