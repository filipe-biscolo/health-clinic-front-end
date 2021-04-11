import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private httpClient: HttpClient) { }

  getAttendances(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/attendances?clinic_id=${idClinic}`).pipe(take(1));
  }

  getAttendancesPaginated(idClinic: string, idPatient: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/attendances?clinic_id=${idClinic}&patient_id=${idPatient}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getAttendancesExport(idClinic: string, idPatient: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/attendances/export?clinic_id=${idClinic}&patient_id=${idPatient}`).pipe(take(1));
  }
  
  getAttendanceById(idClinic: string, idAttendance: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/attendances/${idAttendance}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postAttendance(attendance: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/attendances`, attendance).pipe(take(1));
  }

  putAttendance(attendance: any):Observable<any> {
    return this.httpClient.put<any>(`${API}/attendances/${attendance.id}`, attendance).pipe(take(1));
  }
}
