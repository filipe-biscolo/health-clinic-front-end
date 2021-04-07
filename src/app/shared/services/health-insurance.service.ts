import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {

  constructor(private httpClient: HttpClient) { }

  getHealthInsurances(idClinic: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/health-insurances?clinic_id=${idClinic}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getHealthInsurancesAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/health-insurances/all?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getHealthInsuranceById(idClinic: string, idHealthInsurance: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/health-insurances/${idHealthInsurance}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postHealthInsurance(healthInsurance: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/health-insurances`, healthInsurance).pipe(take(1));
  }

  putHealthInsurance(healthInsurance: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/health-insurances/${healthInsurance.id}`, healthInsurance).pipe(take(1));
  }

  deleteHealthInsurance(idHealthInsurance: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/health-insurances/${idHealthInsurance}`).pipe(take(1));
  }
}
