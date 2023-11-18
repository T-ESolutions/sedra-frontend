import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { cartData } from 'src/app/models/cart';
import { ProductsService } from 'src/app/products/services/products.service';
import Swal from 'sweetalert2';
import { CartsService } from '../../services/carts.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const $:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  checkLogin: any = sessionStorage.getItem('checkLogin') || 'false';
  thumbsSwiper: any;
  quantity:number = 1;
  totalSend:any;
  totalCopounSend:any;
  shippingSend:any;
  discountSend:any;
  userData:any;
  constructor(private _ProductsService:ProductsService,
    private spinner: NgxSpinnerService, private _CartsService:CartsService) {
      this.cart = {
        cart: [],
        total: 1,
        shipping: 1,
        discount: 1
      }
  }

  ngOnInit():void {
    this.getProductOnCart();
    this.userData  = JSON.parse(localStorage.getItem("userData") || '{}');
  };

  // plus amount of product in your cart
  plusAmount(index: number,cartId:number) {
    this.spinner.show();
    this._CartsService.plusCart(cartId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.cart.cart[index].qty++;
        this.getProductOnCart();
      } else {
        this.spinner.hide();
        Swal.fire({
          title: 'خطأ !!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      }
    }, (error) => {
      this.spinner.hide();
    })
    // test comment
  }

  // minas amount of product in your cart
  minsAmount(index: number,cartId:number) {
    this.spinner.show();
    this._CartsService.minusCart(cartId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.cart.cart[index].qty--;
        this.getProductOnCart();
      } else {
        this.spinner.hide();
        Swal.fire({
          title: 'خطأ !!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

   // delete cart of carts
   deleteCart(cartId:number) {
    this.spinner.show();
    this._CartsService.deleteCart(cartId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.getProductOnCart();
      } else {
        this.spinner.hide();
        Swal.fire({
          title: 'خطأ !!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  cart:cartData;
  finalTotalShipping:any=0;
  finalTotalDiscount:any=0;
  finalTotalPrice!:any;
  getProductOnCart() {
    this.spinner.show();
    this._ProductsService.getProductOnCart().subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.cart = response.data;
        localStorage.setItem("cartLength", JSON.stringify(this.cart.cart.length));
        this.totalSend = this.cart.total;
        this.totalCopounSend = this.cart.total;
        this.shippingSend = this.cart.shipping
        this.discountSend = this.cart.discount;

        if(this.checkLogin == 'true') {
          this.finalTotalDiscount = this.cart.discount + this.userData.discount;
        } else {
          this.finalTotalDiscount = this.cart.discount;
        }
        if(this.checkLogin == 'true') {
          this.finalTotalPrice = this.cart.total - ( ((this.userData.discount/100)*this.cart.total) + ((this.cart.discount/100)*this.cart.total) + (this.cart.shipping) );
        } else {
          this.finalTotalPrice = this.cart.total - (((this.cart.discount/100)*this.cart.total) + (this.cart.shipping) );
        }
      } else {
        this.spinner.hide();
        Swal.fire({
          title: 'خطأ !!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      }
    }, (error) => {
      this.spinner.hide();
    })
  };

    // send values to checkout page
    sendValues(){
      sessionStorage.setItem('cartTotal',JSON.stringify(this.cart.total));
      sessionStorage.setItem('finalTotalDiscount',JSON.stringify(this.finalTotalDiscount));
      sessionStorage.setItem('finalTotalPrice',JSON.stringify(this.finalTotalPrice));
      sessionStorage.setItem('copoun',JSON.stringify(this.coupon_code));
      if(this.checkLogin == 'true') {
        sessionStorage.setItem('finalTotalShipping',JSON.stringify(this.userData.shipping_free));
      } else {
        sessionStorage.setItem('finalTotalShipping',JSON.stringify(null));
      }
    }

  copoun:any;
  coupon_code:any=null;
  copounForm: FormGroup = new FormGroup({
    coupon_code: new FormControl(null, [Validators.required]),
    visitor_id: new FormControl(null),
  });

  submitCopounForm(copounForm: FormGroup) {
      this.spinner.show();
      // if user delete [disabled]="registerForm.invalid" from html inspect
      if (copounForm.invalid) {
        this.spinner.hide();
        return;
      } else {
        this.copounForm.patchValue({
          visitor_id: Number(sessionStorage.getItem('visitor_id')) ,
        });
        this._CartsService.applyCopoun(copounForm.value).subscribe((response) => {
          if(response.status == 200) {
            this.coupon_code = copounForm.value.coupon_code;
            this.spinner.hide();
            this.copoun = response.data;
            this.finalTotalDiscount = ((response.data.discount / response.data.sub_total) * 100);
            this.finalTotalPrice = ( this.cart.total - ((this.finalTotalDiscount/100)*this.cart.total));
            this.copounForm.reset();
          } else {
            this.spinner.hide();
          Swal.fire({
            title: 'خطأ !!',
            text: response.msg,
            icon: 'error',
            confirmButtonText: 'موافق',
          });
          }
         }, (error) => {
          this.spinner.hide();
         });
      }
  }
}
