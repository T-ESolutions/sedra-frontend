import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { cartData } from 'src/app/models/cart';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
declare const $: any;
import { cart, product } from 'src/app/models/product';
// install Swiper modules
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/products/services/products.service';
import { Subscription } from 'rxjs';
import { HomeComponent } from 'src/app/products/components/home/home.component';
declare var bootstrap: any;

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss'],
})
export class CartSidebarComponent implements OnInit {
  checkLogin: any = sessionStorage.getItem('checkLogin');
  clickEventSubscription!: Subscription;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ProductsService: ProductsService,
    private spinner: NgxSpinnerService,
    private location: Location
  ) {
    this.cart = {
      cart: [],
      total: 0,
      shipping: 0,
      discount: 0,
    };
  }

  ngOnInit(): void {
    this.clickEventSubscription = this._ProductsService
      .getOrderedProductsOnCart()
      .subscribe(() => {
        this.getProductOnCart();
      });
  }

  cart: cartData;
  getProductOnCart() {
    this.spinner.show();
    this._ProductsService.getProductOnCart().subscribe(
      (response) => {
        if (response.status == 200) {
          this.cart = response.data;
          localStorage.setItem(
            'cartLength',
            JSON.stringify(this.cart.cart.length)
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
          Swal.fire({
            title: 'خطأ !!',
            text: response.msg,
            icon: 'error',
            confirmButtonText: 'موافق',
          });
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
