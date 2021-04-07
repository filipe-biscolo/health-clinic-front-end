import { Component } from '@angular/core';
import { LoginService } from './shared/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public privatePage: boolean;

  constructor(private loginService: LoginService) {
    this.loginService.privatePage.subscribe(response => {
      this.privatePage = response;
    });
  }
}
