import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  getSchedule(idClinic: string, page: number, limit: number, idProfessional: string, date_start, date_end):Observable<any> {
    return this.httpClient.get<any>(`${API}/schedule?clinic_id=${idClinic}&page=${page}&limit=${limit}&professional_id=${idProfessional}&date_start=${date_start}&date_end=${date_end}`).pipe(take(1));
  }

  getScheduleAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/schedule/all?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getSchedulingById(idClinic: string, idScheduling: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/schedule/${idScheduling}?clinic_id=${idClinic}`).pipe(take(1));
  }

  getSchedulingDetailById(idClinic: string, idScheduling: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/schedule/detail/${idScheduling}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postScheduling(scheduling: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/schedule`, scheduling).pipe(take(1));
  }

  putScheduling(scheduling: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/schedule/${scheduling.id}`, scheduling).pipe(take(1));
  }

  deleteScheduling(idScheduling: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/schedule/${idScheduling}`).pipe(take(1));
  }
}
