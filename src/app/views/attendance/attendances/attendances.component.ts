import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { FormUtils } from 'src/app/shared/functions/form-utils';
import { AttendanceService } from 'src/app/shared/services/attendance.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { Permissions } from './../../../shared/enums/permissions';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.scss']
})
export class AttendancesComponent implements OnInit {
  private idClinic = this.loginService.getIdClinic();
  public admin = this.loginService.getAdmin();
  public permissions = this.loginService.getPermissions();
  private idPatient: string;
  attendances: any[];

  listPermissions = Permissions;

  cols: any[];
  exportColumns: any[];
  items: MenuItem[] = [{ label: 'Prontuário' }];
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
    private attendanceService: AttendanceService,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'patient_name', header: 'Paciente' },
      { field: 'professional_name', header: 'Profissional' },
      { field: 'health_insurance_name', header: 'Convênio' },
      { field: 'procedure_name', header: 'Procedimento' },
      { field: 'date_hour', header: 'Início' },
      { field: 'date_hour_end_attendance', header: 'Término' }
    ];

    this.idPatient = this.activatedRoute.snapshot.params.idPatient as string;
		if (!!this.idPatient) {
      this.listAttendances();
    }

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  
  listAttendances() {
    this.load = true;
    this.attendanceService.getAttendancesPaginated(this.idClinic, this.idPatient, this.page, this.rows).subscribe(
      (response) => {
        this.attendances = response.attendances;
        this.totalRecords = response.totalCount;
        this.load = false;
      },
      (error) => {
                this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar atendimentos',
        });
        this.load = false;
      }
    );
  }

  paginate(event) {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.listAttendances();
  }

  refresh(){
    this.first = 0;
    this.page = 0;
    this.listAttendances();
  }

  viewAttendance(id: string) {
    this.router.navigate(['/attendances', 'edit', id]);
  }

  exportExcel() {
    this.loadExport = true;
    this.attendanceService.getAttendancesExport(this.idClinic, this.idPatient).subscribe(
      (response) => {
        FormUtils.exportExcel('healthInsurances', response);
        this.loadExport = false;
      },
      (error) => {
                this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar atendimentos',
        });
        this.loadExport = false;
      }
    );
  }
}
