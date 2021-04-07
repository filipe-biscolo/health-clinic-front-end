import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private httpClient: HttpClient) { }

  forgotPassword(dataUser: any): Observable<any> {
    return this.httpClient.post<any>(`${API}/users/forgot-password`, dataUser)
      .pipe(
        take(1)
      );
  }

  forgotPasswordResend(email: any): Observable<any> {
    return this.httpClient.put<any>(`${API}/users/forgot-password`, { email })
      .pipe(
        take(1)
      );
  }

  newPassword(dataUser: any): Observable<any> {
    return this.httpClient.put<any>(`${API}/users/new-password`, dataUser)
      .pipe(
        take(1)
      );
  }

  userForgotVerify(email: string, code: string): Observable<any> {
    return this.httpClient.get<any>(`${API}/users/new-password/verify?user_email=${email}&code=${code}`)
      .pipe(
        take(1)
      );
  }
}
