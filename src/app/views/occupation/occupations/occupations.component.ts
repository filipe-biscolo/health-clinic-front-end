import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { OccupationService } from '../../../shared/services/occupation.service';

enum Permissions {
  HP = "Profissional da saúde", // Profissional da saúde
  SE = "Secretário", // Secretário
};

@Component({
  selector: 'app-occupations',
  templateUrl: './occupations.component.html',
  styleUrls: ['./occupations.component.scss']
})
export class OccupationsComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  occupations: any[];

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Cargos' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  msgs: Message[] = [];

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  constructor(
    private occupationService: OccupationService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Nome' },
      { field: 'permissions', header: 'Permissões' }
    ];

    this.listOccupations();

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  listOccupations(){
    this.occupationService
    .getOccupations(this.idClinic, this.page, this.rows)
    .subscribe(
      (response) => {
        this.occupations = response.occupations;
        this.occupations.map(oc => oc.permissions = Permissions[oc.permissions]);
        this.totalRecords = response.totalCount;
      },
      (error) => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao carregar cargos'});
      }
    );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listOccupations();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listOccupations();
  }

  editOccupation(id: string) {
    this.router.navigate(['/occupations', 'edit', id]);
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o cargo?',
      header: 'Excluir cargo',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
          this.deleteOccupation(id);
      },
      reject: () => { }
  });
  }
  deleteOccupation(id: string) {
    this.occupationService
    .deleteOccupation(id)
    .subscribe(
      (response) => {
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Cargo excluido com sucesso!'});
        this.refresh();
      },
      (error) => {
        this.messageService.add({severity:'error', summary: 'Erro', detail: 'Erro ao exluir cargo'});
      }
    );
  }

  exportPdf() {
    FormUtils.exportPdf('occupations', this.exportColumns, this.occupations);
  }

  exportExcel() {
    FormUtils.exportExcel('occupations', this.occupations);
  }
}
