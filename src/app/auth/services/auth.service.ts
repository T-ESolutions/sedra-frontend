import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: any = 'https://80fekra.limazola.com/api/';
  visitor_id: any;
  constructor(private _Router: Router, private _http: HttpClient) {}

  // signIn api
  signIn(loginForm: any): Observable<any> {
    return this._http.post(`${this.baseUrl}v1/auth/login`, loginForm);
  }

  // signUp api
  signUp(signupForm: any): Observable<any> {
    return this._http.post(`${this.baseUrl}v1/auth/sign-up`, signupForm);
  }

  // verify signup form
  verifySignup(verifyForm: any): Observable<any> {
    return this._http.post(`${this.baseUrl}v1/auth/verify`, verifyForm);
  }

  // verify signup form
  forgetPassword(forgetForm: any): Observable<any> {
    return this._http.post(
      `${this.baseUrl}v1/auth/forget-password`,
      forgetForm
    );
  }

  // logOut api
  logOut(): Observable<any> {
    return this._http.get(`${this.baseUrl}v1/auth/logout`);
  }
}
