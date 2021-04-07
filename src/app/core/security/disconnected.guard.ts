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
export class DisconnectedGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.loginService.hasToken()) {
      this.router.navigate(['/login']);
      this.loginService.privatePage.emit(false);
      this.loginService.removeToken();
      return false;
    } else if (this.loginService.getExpiration() < new Date()) {
      this.router.navigate(['/login']);
      this.loginService.privatePage.emit(false);
      this.loginService.removeToken();
      return false;
    } else this.loginService.privatePage.emit(true);
    return true;
  }
}
