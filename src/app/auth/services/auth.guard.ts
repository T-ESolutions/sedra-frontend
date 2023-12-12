import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _Router: Router, private spinner: NgxSpinnerService){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let check = localStorage.getItem("checkLogin")
        if (check != "true" ) {
            Swal.fire({
            title: 'خطأ !!',
            text: "يجب تسجيل الدخول اولا ",
            icon: 'warning',
            confirmButtonText: 'موافق',
            confirmButtonColor: "#7A9987",
          }).then((result) => {
            $('#loginModal').modal('show');
          })
          return false;
        } else {
          return true;
        }
  }
}
