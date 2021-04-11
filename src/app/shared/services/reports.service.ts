import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private httpClient: HttpClient) { }

  getProcedures(idClinic: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports/procedures?clinic_id=${idClinic}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }

  getHealthInsurances(idClinic: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports/health-insurances?clinic_id=${idClinic}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }

  getProfessionals(idClinic: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports/professionals?clinic_id=${idClinic}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }

  getPatients(idClinic: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports/patients?clinic_id=${idClinic}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }

  getSchedulingStatus(idClinic: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports/scheduling-status?clinic_id=${idClinic}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }
}
