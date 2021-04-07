import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { City, State } from '../model/address';

const API = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient) { }


  getStates(): Observable<State[]> {
    return this.httpClient.get<State[]>(`${API}/states`).pipe(take(1));
  }

  getStateById(idState: number): Observable<State> {
    return this.httpClient.get<State>(`${API}/states/${idState}`).pipe(take(1));
  }

  getCitiesByStateId(idState: number): Observable<City[]> {
    return this.httpClient.get<City[]>(`${API}/cities/${idState}`).pipe(take(1));
  }
  
  getCitiesDetail(idCity: number): Observable<City> {
      return this.httpClient.get<City>(`${API}/cities/detail/${idCity}`).pipe(take(1));
  }
}
