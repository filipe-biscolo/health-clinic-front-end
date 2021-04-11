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
import { HealthInsuranceService } from '../../../shared/services/health-insurance.service';

@Component({
  selector: 'app-health-insurances',
  templateUrl: './health-insurances.component.html',
  styleUrls: ['./health-insurances.component.scss'],
})
export class HealthInsurancesComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  healthInsurances: any[];

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Convênios' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  msgs: Message[] = [];

  page = 0;
  totalRecords = 0;
  rowsPerPageOptions = [5, 10, 20];
  rows = this.rowsPerPageOptions[0];
  first = 0;

  load = false;
  loadExport = false;

  constructor(
    private healthInsuranceService: HealthInsuranceService,
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cols = [{ field: 'name', header: 'Nome' }];

    this.listHI();

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  
  listHI() {
    this.load = true;
    this.healthInsuranceService.getHealthInsurances(this.idClinic, this.page, this.rows).subscribe(
      (response) => {
        
        this.healthInsurances = response.healthInsurances;
        this.totalRecords = response.totalCount;
        this.load = false;
      },
      (error) => {
        this.load = false;
                this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar convênios',
        });
      }
    );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listHI();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listHI();
  }

  editHI(id: string) {
    this.router.navigate(['/health-insurances', 'edit', id]);
  }

  confirmDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o convênio?',
      header: 'Excluir convênio',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteHI(id);
      },
      reject: () => {},
    });
  }

  deleteHI(id: string) {
    this.healthInsuranceService.deleteHealthInsurance(id).subscribe(
      (response) => {
        if(response.status === true){
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Convênio excluido com sucesso!',
          });
          this.refresh();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Alerta',
            detail: 'Convênio em uso, não é possível excluí-lo!',
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao exluir convênio',
        });
      }
    );
  }

  exportExcel() {
    this.loadExport = true;
    this.healthInsuranceService.getHealthInsurancesExport(this.idClinic).subscribe(
      (response) => {
        FormUtils.exportExcel('healthInsurances', response);
        this.loadExport = false;
      },
      (error) => {
        this.loadExport = false;
                this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar convênios',
        });
      }
    );
  }
}
