import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  checkLogin: any = sessionStorage.getItem('checkLogin') || 'false';

  private subject = new Subject<any>();
  constructor(
    private _Router: Router,
    private _http: HttpClient,
    private _AuthService: AuthService
  ) {

  }

  // get home data
  getHomeData(visitor_id:any): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.get(`${this._AuthService.baseUrl}v1/home`);
    } else {
      return this._http.get(`${this._AuthService.baseUrl}v1/home?visitor_id=${visitor_id}`);
    }
  }

  // get product details
  getProductDetails(productId: number): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/details?id=${productId}`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/details?id=${productId}&visitor_id=${visitor_id}`
      );
    }
  }

  // get product details
  getRelatedProducts(productId: number): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/related?id=${productId}`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/related?id=${productId}&visitor_id=${visitor_id}`
      );
    }
  }

  // get products by category
  getProductsByCategory(categoryId: number): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/by-category?category_id=${categoryId}`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/by-category?category_id=${categoryId}&visitor_id=${visitor_id}`
      );
    }
  }

  // get all category products
  getAllCategoryProducts(): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/by-category?`
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.get(
        `${this._AuthService.baseUrl}v1/product/by-category?visitor_id=${visitor_id}`
      );
    }
  }

  // add product to cart
  addToCart(product: any): Observable<any> {
    if(this.checkLogin == 'true') {
      return this._http.post(
        `${this._AuthService.baseUrl}v1/cart/add-cart`,
        product
      );
    } else {
      let visitor_id = Number(sessionStorage.getItem('visitor_id'));
      return this._http.post(
        `${this._AuthService.baseUrl}v1/cart/add-cart?visitor_id=${visitor_id}`,
        product
      );
    }
  }

  // get products on cart
  getProductOnCart(): Observable<any> {
    let visitor_id = Number(sessionStorage.getItem('visitor_id'));
    return this._http.get(
      `${this._AuthService.baseUrl}v1/cart/get-cart?visitor_id=${visitor_id}`
    );

  }

   // add review
   addReview(reviewForm: any): Observable<any> {
    return this._http.post(
      `${this._AuthService.baseUrl}v1/product/add-review`,
      reviewForm
    );
  };


  // this functions to call api of get products on cart on child component
  orderProductsOnCart() {
    this.subject.next("");
  };
  getOrderedProductsOnCart():Observable<any> {
    return this.subject.asObservable()
  }
}
