import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  items: MenuItem[] = [{ label: 'Relatórios' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  reportProcedures: any[];
  reportHealthInsurances: any[];
  reportProfessionals: any[];
  reportPatients: any[];
  reportSchedulingStatus: any[];
  
  dateStart = null;
  dateEnd = null;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Procedimentos';
  showYAxisLabel = true;
  yAxisLabel = 'Nos últimos 30 dias';

  colorScheme = {
    domain: ['#794C74', '#FADCAA', '#C56183', '#B2DEEC', '#9D2503', '#7FA998', '#DF8543', '#F1F1B0']
  };

  constructor(
    private loginService: LoginService,
    private reportsService: ReportsService
  ) {
    const date = new Date();
    this.dateStart = this.dateHTML(new Date().getFullYear(), 0, 1);
    this.dateEnd = this.dateNowHTML();
  }

  ngOnInit(): void {
    this.searchReports();
  }

  get noReports(): boolean {
    let count = 0;
    if(!this.reportProcedures || this.reportProcedures.length <= 0){
      count++;
    }
    if(!this.reportHealthInsurances || this.reportHealthInsurances.length <= 0){
      count++;
    }
    if(!this.reportProfessionals || this.reportProfessionals.length <= 0){
      count++;
    }
    if(!this.reportPatients || this.reportPatients.length <= 0){
      count++;
    }
    if(!this.reportSchedulingStatus || this.reportSchedulingStatus.length <= 0){
      count++;
    }
    
    return count === 5 ? true : false;
  }

  searchReports(){
    this.reportsService.getProcedures(this.idClinic, this.dateStart, this.dateEnd)
    .subscribe(response => {
      this.reportProcedures = response;
    }, error => {
      console.error(error)
    });

  this.reportsService.getHealthInsurances(this.idClinic, this.dateStart, this.dateEnd)
    .subscribe(response => {
      this.reportHealthInsurances = response;
    }, error => {
      console.error(error)
    });

  this.reportsService.getProfessionals(this.idClinic, this.dateStart, this.dateEnd)
    .subscribe(response => {
      this.reportProfessionals = response;
    }, error => {
      console.error(error)
    });

  this.reportsService.getPatients(this.idClinic, this.dateStart, this.dateEnd)
    .subscribe(response => {
      this.reportPatients = response;
    }, error => {
      console.error(error)
    });

  this.reportsService.getSchedulingStatus(this.idClinic, this.dateStart, this.dateEnd)
    .subscribe(response => {
      this.reportSchedulingStatus = response;
    }, error => {
      console.error(error)
    });
  }

  dateHTML(year: number, month: number, number: number){
    let date = new Date(year, month, number);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0,10);
  }

  dateNowHTML(){
    let dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - dateNow.getTimezoneOffset());
    return dateNow.toISOString().slice(0,10);
  }

}
