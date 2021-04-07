import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';

declare var $: any;

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  public admin = this.loginService.getAdmin();
  
  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {}

  toggleSideBar() {
    const mq = window.matchMedia('(max-width: 40rem)');
    if(mq.matches){
      $('#navigation').toggleClass('sidebar-toggle');
    }
  }

}
