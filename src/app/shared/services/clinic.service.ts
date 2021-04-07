import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  static updateHeader = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  getClinicById(idClinic: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/clinic/${idClinic}`).pipe(take(1));
  }

  putClinic(clinic: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/clinic/${clinic.id}`, clinic).pipe(take(1));
  }

  updateHeader() {
    ClinicService.updateHeader.emit(true);
  }
}
