import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ClinicService } from 'src/app/shared/services/clinic.service';
import { LoginService } from '../../../shared/services/login.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private idClinic = this.loginService.getIdClinic();
  private idUser = this.loginService.getIdUser();
  public admin = this.loginService.getAdmin();

  userName = '';
  clinicName = '';

  items: any[];

  unsub$ = new Subject();

  visible = false;
  
  constructor(
    private loginService: LoginService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.items = [
      {
          label: 'File',
          items: [{
                  label: 'New', 
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label: 'Project'},
                      {label: 'Other'},
                  ]
              },
              {label: 'Open'},
              {label: 'Quit'}
          ]
      },
      {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
              {label: 'Delete', icon: 'pi pi-fw pi-trash'},
              {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
          ]
      }
  ];

  this.dataHeader();

  ClinicService.updateHeader
  .pipe(takeUntil(this.unsub$))
  .subscribe(
    response => { this.dataHeader(); },
    error => { console.error(error); });
  }

  ngOnDestroy(){
    this.unsub$.next();
    this.unsub$.complete();
  }

  dataHeader() {
    this.loginService.getDataHeader(this.idUser, this.idClinic).subscribe(
      (response) => {
        console.log('getDataHeader', response);
        this.userName = response.data.user_name;
        this.clinicName = response.data.clinic_name;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  clinic() {
    this.router.navigate(['/clinic', this.idClinic]);
  }

  toggleSidebar() {
    $('#navigation').toggleClass('sidebar-toggle');
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }  
}
