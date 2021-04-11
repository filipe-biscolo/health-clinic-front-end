import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {

  constructor(private httpClient: HttpClient) { }

  getProcedures(idClinic: string, page: number, limit: number):Observable<any> {
    return this.httpClient.get<any>(`${API}/procedures?clinic_id=${idClinic}&page=${page}&limit=${limit}`).pipe(take(1));
  }

  getProceduresAll(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/procedures/all?clinic_id=${idClinic}`).pipe(take(1));
  }

  getProceduresExport(idClinic: string):Observable<any[]> {
    return this.httpClient.get<any[]>(`${API}/procedures/export?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  getProcedureById(idClinic: string, idProcedure: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/procedures/${idProcedure}?clinic_id=${idClinic}`).pipe(take(1));
  }
  
  postProcedure(procedure: any):Observable<any[]> {
    return this.httpClient.post<any[]>(`${API}/procedures`, procedure).pipe(take(1));
  }

  putProcedure(procedure: any):Observable<any[]> {
    return this.httpClient.put<any[]>(`${API}/procedures/${procedure.id}`, procedure).pipe(take(1));
  }

  deleteProcedure(idProcedure: string):Observable<any> {
    return this.httpClient.delete<any>(`${API}/procedures/${idProcedure}`).pipe(take(1));
  }
}
