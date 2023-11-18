import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _Router: Router,
    private _http: HttpClient,
    private _AuthService: AuthService
  ) {}

  // get profile data
  getProfileData(): Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/auth/profile`);
  }

  // change password
  changePassword(passwordForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/change-password`,
      passwordForm
    );
  }

  // resend code
  resendCode(codeForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/resend-code`,
      codeForm
    );
  }

  // update profile
  updateProfile(profileData: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/update-profile`,
      profileData
    );
  }

  // get all orders
  getOrders(type:string): Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/order/my-orders?status=${type}`);
  }

  // update email
  updateEmail(emailForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/update-profile/check/email`,
      emailForm
    );
  }

  // verify email updated
  verifyEmailUpdated(verifyEmailForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/update-profile/check/email/code`,
      verifyEmailForm
    );
  }

  // check phone to update it
  checkPhoneUpdate(phoneForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/update-profile/check/phone`,
      phoneForm
    );
  }

   // verify phone updated
   verifyPhoneUpdated(verifyPhoneForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/auth/update-profile/check/phone/code`,
      verifyPhoneForm
    );
  };

  // get all addresses
   getAddresses(): Observable<any> {
    return this._http.get(`${this._AuthService.baseUrl}v1/addresses`);
  }

  // delete address
  deleteAddress(address_id:number): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/addresses/delete?id=${address_id}`,
      null
    );
  };

  makeAddressDefault(address_id: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/addresses/make-default?id=${address_id}`,
      null
    );
  };

    // get address details
    getAddressDetails(addressId: number): Observable<any> {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/addresses/details?id=${addressId}`
      );
    }


     // add address api
  addAddress(addAddressForm:any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/addresses/store`, addAddressForm );
  }

      // add address api
      updateAddress(updateAddressForm:any): Observable<any> {
        return this._http.post(
          `${this._AuthService.baseUrl}v1/addresses/update`, updateAddressForm );
      }
}
