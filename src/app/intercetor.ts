import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class MyIntercetor implements HttpInterceptor {
  constructor(private _Router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newReq = req.clone({
      headers: new HttpHeaders({
        lang: 'ar',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      }),
    });
    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          if (error.status == 401) {
            this._Router.navigate(['/home']);
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: 'انتهت صلاحية الرمز المميز !!',
              icon: 'error',
              confirmButtonText: 'موافق',
            }).then((result) => {
              this._Router.navigate(['/home']);
              localStorage.removeItem('checkLogin');
              localStorage.removeItem('jwt');
              window.location.reload();
            });
          } else if (error.status == 422 && error.error.errors.phone) {
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: error.error.errors.phone[0],
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else if (error.status == 422 && error.error.errors.email) {
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: error.error.errors.email[0],
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else if (
            error.status != 422 &&
            error.status != 401 &&
            error.status != 406
          ) {
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: 'خطأ غير معروف من الخادم !!',
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else if (
            error.status == 422 &&
            error.error.errors.coupon_code[0] ==
              'القيمة المحددة كوبون الخصم غير موجودة.'
          ) {
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: 'القيمة المحددة كوبون الخصم غير موجودة.',
              icon: 'error',
              confirmButtonText: 'موافق',
            });
            // this._Router.navigate(['/not-found']);
          } else if (error.status == 406) {
            this._Router.navigate(['/not-found']);
          }
          // else {
          //   Swal.fire({
          // confirmButtonColor: "#7A9987",
          //     title: 'خطأ !!',
          //     text: 'خطأ غير معروف من الخادم !!',
          //     icon: 'error',
          //     confirmButtonText: 'موافق',
          //   });
          // }
        }
        return throwError(errorMsg);
      })
    );
  }
}
