import { EventEmitter, Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login, LoginToken, TokenJWT } from 'src/app/shared/model/model.barrel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { take, tap } from 'rxjs/operators';
import { SocialAuthService } from 'angularx-social-login';

const API = environment.API_URL;
const tokenLabel = 'TokenHC';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private idClinic: string;
  private idUser: string;
  private idProfessional: string;
  private permissions: string;
  private admin: boolean;
  private expiration: Date;

  constructor(
    private httpClient: HttpClient,
    private authService: SocialAuthService
  ) {
    this.hasToken() && this.decodeJWT();
  }


  signIn(dataLogin: Login): Observable<LoginToken> {
    const headers = {
      headers: new HttpHeaders({
      jwtusername: dataLogin.email,
      jwtpassword: dataLogin.password
    })
  }
    return this.httpClient.post<LoginToken>(`${API}/login`, dataLogin)
      .pipe(
        take(1),
        tap(response => this.setToken(response.token))
      );
  }

  signInSocial(dataLogin: any): Observable<any> {
    return this.httpClient.post<any>(`${API}/login/social`, dataLogin)
      .pipe(
        tap(console.log),
        take(1),
        tap(response => {
          if(response.status === true){
            this.setToken(response.data.token)
          }
        })
      );
  }

  public logout(): void {
    this.signOutSocial();
    this.removeToken();
    this.privatePage.emit(false);
  }

  signOutSocial(): void {
    this.authService.authState.subscribe((user) => {
      const googleUser = user;
      if (googleUser) {
        this.authService.signOut(true);
        return;
      }
    });
  }

  private setToken(token: string): void {
    window.localStorage.setItem(tokenLabel, token);
    this.decodeJWT();
  }

  public getToken(): string {
    return window.localStorage.getItem(tokenLabel);
  }

  public hasToken(): boolean {
    return !!this.getToken();
  }

  public removeToken() {
    window.localStorage.removeItem(tokenLabel);
  }

  private decodeJWT() {
    const token = this.getToken();
    const { id, clinic_id, professional_id, admin, permissions, exp} = jwt_decode(token) as TokenJWT;

    this.idUser = id;
    this.idClinic = clinic_id;
    this.idProfessional = professional_id;
    this.admin = admin;
    this.permissions = permissions;
    this.expiration = new Date(exp * 1000);
  }

  public getIdUser(): string {
    return this.idUser;
  }

  public getIdClinic(): string {
    return this.idClinic;
  }

  public getIdProfessional(): string {
    return this.idProfessional;
  }

  public getExpiration(): Date {
    return this.expiration;
  }

  public getAdmin(): boolean {
    return this.admin;
  }
  
  public getPermissions(): string {
    return this.permissions;
  }

  getDataHeader(idUser: string, idClinic: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/data-header/${idUser}?clinic_id=${idClinic}`);
  }

  public privatePage = new EventEmitter<boolean>();
}
