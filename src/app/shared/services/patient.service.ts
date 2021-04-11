import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private httpClient: HttpClient) { }

  getPatients(idClinic: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/patients?clinic_id=${idClinic}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getPatientsAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/patients/all?clinic_id=${idClinic}`).pipe(take(1));
  }

  getPatientsExport(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/patients/export?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getPatientById(idClinic: string, idPatient: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/patients/${idPatient}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postPatient(patient: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/patients`, patient).pipe(take(1));
  }

  putPatient(patient: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/patients/${patient.id}`, patient).pipe(take(1));
  }

  deletePatient(idPatient: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/patients/${idPatient}`).pipe(take(1));
  }
}
