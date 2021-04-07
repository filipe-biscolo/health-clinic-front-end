import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { TokenJWT } from 'src/app/shared/model/model.barrel';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpClient: HttpClient) { }

  queue(dataUser: any): Observable<any> {
    return this.httpClient.post<any>(`${API}/queue`, dataUser)
      .pipe(
        take(1)
      );
  }

  queueResend(email: string): Observable<any> {
    return this.httpClient.put<any>(`${API}/queue`, {email})
      .pipe(
        take(1)
      );
  }

  signUp(dataUser: any): Observable<any> {
    return this.httpClient.post<any>(`${API}/signup`, dataUser)
      .pipe(
        take(1)
      );
  }

  verifyUserQueue(email: string, code: string): Observable<any> {
    return this.httpClient.get<any>(`${API}/queue/verify?user_email=${email}&code=${code}`)
      .pipe(
        take(1)
      );
  }

  queueSocial(dataUser: any): Observable<any> {
    return this.httpClient.post<any>(`${API}/queue/social`, dataUser)
      .pipe(
        take(1)
      );
  }

  updateClinic(dataClinic: any): Observable<any> {
    return this.httpClient.put<any>(`${API}/signup/clinic/${dataClinic.id}`, dataClinic)
      .pipe(
        take(1)
      );
  }
}
