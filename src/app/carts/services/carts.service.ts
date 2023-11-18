import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  visitorForm: any = { visitor_id: null };
  checkLogin: any = sessionStorage.getItem('checkLogin') || 'false';
  constructor(private _http: HttpClient, private _AuthService: AuthService) {}

  // plus cart
  plusCart(cartId: any): Observable<any> {
    if (this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/cart/plus-cart/${cartId}`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/cart/plus-cart/${cartId}?visitor_id=${visitor_id}`
      );
    }
  }

  // minus cart
  minusCart(cartId: any): Observable<any> {
    if (this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/cart/minus-cart/${cartId}`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/cart/minus-cart/${cartId}?visitor_id=${visitor_id}`
      );
    }
  }

  // delete cart
  deleteCart(cartId: any): Observable<any> {
    return this._http.get(
      `${this._AuthService.baseUrl}v1/cart/delete-cart/${cartId}`
    );
  }

  // apply copoun
  applyCopoun(copounForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/order/apply-coupon`,
      copounForm
    );
  }

  // get order details
  getOrderDetails(orderId: number): Observable<any> {
    return this._http.get(
      `${this._AuthService.baseUrl}v1/order/order-details/${orderId}`
    );
  }

  // cancel order
  cancelOrder(orderId: number): Observable<any> {
    return this._http.get(
      `${this._AuthService.baseUrl}v1/order/delete-order/${orderId}`
    );
  }

  // place order
  placeOrder(visitorForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/order/place-order`,
      visitorForm
    );
  }

  // place order with copoun
  placeOrderWithCopoun(
    address_id: any,
    coupon_code: any,
    payment_type: any,
    notes: any
  ): Observable<any> {
    this.visitorForm.visitor_id = Number(sessionStorage.getItem('visitor_id'));
    return this._http.post(
      `${this._AuthService.baseUrl}v1/order/place-order?address_id=${address_id}&coupon_code=${coupon_code}&payment_type=${payment_type}&notes=${notes}`,
      this.visitorForm.value
    );
  }
  // place order without copoun
  placeOrderWithoutCopoun(
    address_id: any,
    payment_type: any,
    notes: any
  ): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/order/place-order?address_id=${address_id}&payment_type=${payment_type}&notes=${notes}`,
      this.visitorForm.value
    );
  }

  // change address of order
  changeOrderAddress(address_id: any, order_id: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/order/update-address?address_id=${address_id}&order_id=${order_id}`,
      null
    );
  }
}
