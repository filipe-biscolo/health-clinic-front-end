import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  items: MenuItem[] = [{ label: 'Relatórios' }];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/schedule' };

  reportProcedures: any[] = [
    {
      "name": "Consulta simples",
      "value": 52
    },
    {
      "name": "Exame de rotina",
      "value": 10
    },
    {
      "name": "Cirurgia dentária",
      "value": 3
    }
  ];
  reportHI: any[] = [
    {
      "name": "UNIMED",
      "value": 25
    },
    {
      "name": "SUS",
      "value": 15
    },
    {
      "name": "Particular",
      "value": 35
    }
  ];

  view: any[] = [100, 50];

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
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

}
