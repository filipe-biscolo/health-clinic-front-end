import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/schedule']);
    }, 1000);
  }

}
