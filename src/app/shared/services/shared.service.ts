import { HttpClient } from '@angular/common/http';
import { Injectable  } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private _Router: Router, private _http: HttpClient, private _AuthService: AuthService) {};

  // get all countries
  getCountries():Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/helpers/countries`)
  }

  // get all cities
  getCities(countryId:any):Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/helpers/cities?country_id=${countryId}`)
  }

  // get all pages
  getPages():Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/helpers/pages`)
  }

  // get page details
  getPageDetails(pageId: number): Observable<any> {
    return this._http.get(
      `${this._AuthService.baseUrl}v1/helpers/page/details?id=${pageId}`
    );
  }

   // get all settings
   getSettings():Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/settings`)
  }

   // page details routing
  private subject = new Subject<any>();
  sendPageId(id:any) {
    this.subject.next(id)
  }

  getEvent():Observable<any> {
    return this.subject.asObservable()
  }

  // this function to check visitor
  checkvisitor(visitorForm:any): Observable<any> {
      return this._http.post(`${this._AuthService.baseUrl}v1/visitor/check`, visitorForm )
    }

}
