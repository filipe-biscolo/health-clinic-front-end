import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class OccupationService {

  constructor(private httpClient: HttpClient) { }

  getOccupations(idClinic: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/occupations?clinic_id=${idClinic}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getOccupationsAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/occupations/all?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getOccupationById(idClinic: string, idOccupation: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/occupations/${idOccupation}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postOccupation(occupation: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/occupations`, occupation).pipe(take(1));
  }

  putOccupation(occupation: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/occupations/${occupation.id}`, occupation).pipe(take(1));
  }

  deleteOccupation(idOccupation: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/occupations/${idOccupation}`).pipe(take(1));
  }
}
