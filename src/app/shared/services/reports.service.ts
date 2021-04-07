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

  getSchedule(idClinic: string):Observable<any> {
    return this.httpClient.get<any>(`${API}/reports?clinic_id=${idClinic}`).pipe(take(1));
  }
}
