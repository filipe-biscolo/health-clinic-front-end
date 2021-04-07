import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../shared/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectedGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.loginService.hasToken()) {
      this.router.navigate(['/loading']);
      this.loginService.privatePage.emit(true);
      return false;
    }
    return true;
  }
}
