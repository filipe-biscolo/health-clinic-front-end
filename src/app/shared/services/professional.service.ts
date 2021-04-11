import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  constructor(private httpClient: HttpClient) { }
  
  getProfessionals(idClinic: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/professionals?clinic_id=${idClinic}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getProfessionalsAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/professionals/all?clinic_id=${idClinic}`).pipe(take(1));
  }

  getProfessionalsExport(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/professionals/export?clinic_id=${idClinic}`).pipe(take(1));
  }

  getProfessionalsSchedule(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/professionals/schedule?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getProfessionalById(idClinic: string, idProfessional: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/professionals/${idProfessional}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postProfessional(professional: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/professionals`, professional).pipe(take(1));
  }

  putProfessional(professional: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/professionals/${professional.id}`, professional).pipe(take(1));
  }

  deleteProfessional(idProfessional: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/professionals/${idProfessional}`).pipe(take(1));
  }

  getProfessionalHIs(idProfessional: any, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/professionals/${idProfessional}/hi?page=${page}&limit=${limit}`).pipe(take(1));
  }

  postProfessionalHI(professional: any, health_insurance_id: string):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/professionals/hi?health_insurance_id=${health_insurance_id}`, professional).pipe(take(1));
  }

  deleteProfessionalHI(idHealthInsurance: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/professionals/hi/${idHealthInsurance}`).pipe(take(1));
  }
}
