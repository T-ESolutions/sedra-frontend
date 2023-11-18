import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { cartData } from 'src/app/models/cart';
import { address } from 'src/app/models/helper';
import { ProductsService } from 'src/app/products/services/products.service';
import { UserService } from 'src/app/user/services/user.service';
declare const $: any;
import Swal from 'sweetalert2';
import { CartsService } from '../../services/carts.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent implements OnInit {
  visitor_id: any = Number(sessionStorage.getItem('visitor_id'));
  checkLogin: any = localStorage.getItem('checkLogin') || 'false';
  totalSend: any = localStorage.getItem('totalSend');
  totalCopounSend: any = localStorage.getItem('totalCopounSend');
  shippingSend: any = localStorage.getItem('shippingSend');
  discountSend: any = localStorage.getItem('discountSend');
  coupon_code: any = JSON.parse(sessionStorage.getItem('copoun') || '');
  payment_type: any;
  userData: any;
  visitorData: any;
  notes: any = '';
  constructor(
    private _UserService: UserService,
    private spinner: NgxSpinnerService,
    private _ProductsService: ProductsService,
    private _CartsService: CartsService,
    private _Router: Router,
    private _SharedService: SharedService
  ) {
    this.cart = {
      cart: [],
      total: 1,
      shipping: 1,
      discount: 1,
    };
    if (this.checkLogin == 'true') {
      this.getAllAddresses();
    } else {
    }
  }

  ngOnInit(): void {
    this.visitorData = JSON.parse(
      sessionStorage.getItem('visitorData') || '{}'
    );
    // this.visitorForm.patchValue({
    //   f_name: this.visitorData.f_name,
    //   phone: this.visitorData.phone,
    //   address: this.visitorData.address,
    // });

    if (this.checkLogin == 'true') {
    } else {
      this.cartTotal = JSON.parse(sessionStorage.getItem('cartTotal') || '0');
      this.finalTotalPrice = this.cartTotal + this.country_shipping_cost;
      this.finalTotalShipping = JSON.parse(
        sessionStorage.getItem('finalTotalShipping') || '0'
      );
      this.finalTotalDiscount = JSON.parse(
        sessionStorage.getItem('finalTotalDiscount') || '0'
      );
      this.finalTotalPrice =
        this.finalTotalPrice - (this.finalTotalDiscount / 100) * this.cartTotal;
    }

    this.getAllCountries();

    this.getProductOnCart();
    this.payment_type = $('input[name=payCheck]:checked', '#payCard').val();
    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');

    $('#payCard input').on('change', () => {
      this.payment_type = $('input[name=payCheck]:checked', '#payCard').val();
    });
  }

  sendNoteValue(key: any) {
    if (
      key.target.value == null ||
      key.target.value == '' ||
      key.target.value == ''
    ) {
      this.notes = null;
    } else {
      this.notes = key.target.value;
    }
  }

  basicAddress: address = {
    id: 0,
    address: '',
    f_name: '',
    l_name: '',
    phone: '',
    country_id: 0,
    country_title: '',
    city_id: 0,
    city_title: '',
    city_shipping_cost: 0,
    email: '',
    is_default: 0,
    country_shipping_cost: 0,
  };

  cartTotal: any = 0;
  finalTotalShipping: any = 0;
  finalTotalDiscount: any = 0;
  finalTotalPrice!: any;
  addresses: any[] = [];
  // get all addresses
  getAllAddresses() {
    this.spinner.show();
    this._UserService.getAddresses().subscribe(
      (response) => {
        if (response.status == 200) {
          this.cartTotal = JSON.parse(
            sessionStorage.getItem('cartTotal') || '0'
          );
          this.finalTotalShipping = JSON.parse(
            sessionStorage.getItem('finalTotalShipping') || '0'
          );
          this.finalTotalDiscount = JSON.parse(
            sessionStorage.getItem('finalTotalDiscount') || '0'
          );
          this.spinner.hide();
          this.addresses = response.data.data;
          for (var i = 0; i <= this.addresses.length; i++) {
            if (this.addresses[i]?.is_default == 1) {
              this.basicAddress = this.addresses[i];
              if (this.finalTotalShipping == true) {
                this.finalTotalShipping = 0;
              } else {
                this.finalTotalShipping =
                  this.basicAddress.country_shipping_cost;
              }
              // return;
            } else {
              this.basicAddress.is_default = 0;
            }
          }
          this.finalTotalPrice =
            this.cartTotal +
            this.finalTotalShipping -
            (this.finalTotalDiscount / 100) * this.cartTotal;
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

  cart: cartData;
  fTotal: number = 0;
  ffTotal: number = 0;
  getProductOnCart() {
    this.spinner.show();
    this._ProductsService.getProductOnCart().subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.cart = response.data;
          localStorage.setItem(
            'cartLength',
            JSON.stringify(this.cart.cart.length)
          );
          if (
            this.userData.discount != 0 &&
            this.basicAddress.country_shipping_cost != 0
          ) {
            this.fTotal = (this.userData.discount / 100) * this.cart.total;
            this.ffTotal =
              this.fTotal - Number(this.basicAddress.city_shipping_cost);
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
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  placeOrder() {
    if (this.checkLogin == 'true') {
      if (this.basicAddress.id == 0) {
        Swal.fire({
          title: 'تحذير !!',
          text: 'يجب إضافة عنوان الشحن اولآ قبل تأكيد الطلب',
          icon: 'warning',
          confirmButtonText: 'موافق',
        });
      } else {
        if (this.coupon_code == null || this.coupon_code == "null") {
          this.spinner.show();
          this._CartsService
            .placeOrderWithoutCopoun(
              this.basicAddress.id,
              this.payment_type,
              this.notes
            )
            .subscribe(
              (response) => {
                if (response.status == 200) {
                  this.spinner.hide();
                  let order_id = response.data.order_id;
                  Swal.fire({
                    title: 'نجاح !!',
                    text: `تم الطلب بنجاح، كود طلبك ${order_id}
                  يتم توصيل الطلب خلال 1-6 أيام، في حالة وجود أي مشكلة، برجاء التواصل مع الرقم التالي 01033334454 (9ص:5م).
                   شكرًا لثقتك في منتجات منظومة العباقرة 80فكرة
                  `,
                    icon: 'success',
                    confirmButtonText: 'موافق',
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    sessionStorage.removeItem("copoun")
                    this._Router.navigate(['/my-orders']);
                    this.getProductOnCart();
                  });
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
        } else {
          this.spinner.show();
          this._CartsService
            .placeOrderWithCopoun(
              this.basicAddress.id,
              this.coupon_code,
              this.payment_type,
              this.notes
            )
            .subscribe(
              (response) => {
                if (response.status == 200) {
                  this.spinner.hide();
                  let order_id = response.data.order_id;
                  Swal.fire({
                    title: 'نجاح !!',
                    text: `تم الطلب بنجاح، كود طلبك ${order_id}
                  يتم توصيل الطلب خلال 1-6 أيام، في حالة وجود أي مشكلة، برجاء التواصل مع الرقم التالي 01033334454 (9ص:5م).
                   شكرًا لثقتك في منتجات منظومة العباقرة 80فكرة
                  `,
                    icon: 'success',
                    confirmButtonText: 'موافق',
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    sessionStorage.removeItem("copoun")
                    this._Router.navigate(['/my-orders']);
                    this.getProductOnCart();
                  });
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
      }
    } else {
      $('#chooseStateModal').modal('show');
    }
  }

  showVisitorModal() {
    $('#chooseStateModal').modal('hide');
    $('#visitorModal').modal('show');
  }

  showLoginModal() {
    $('#chooseStateModal').modal('hide');
    $('#loginModal').modal('show');
  }

  showChangeAddressModal() {
    $('#changeAddressModal').modal('show');
  }

  hideChangeAddressModal() {
    $('#changeAddressModal').modal('hide');
  }

  changeChoosedAddress(e: any, addressId: any) {
    this.spinner.show();
    this._UserService.makeAddressDefault(addressId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.getAllAddresses();
      }
    });
  }

  deleteAddress(addressId: any) {
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد حذف العنوان؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم , أنا متأكد  ',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this._UserService.deleteAddress(addressId).subscribe(
          (response) => {
            if (response.status == 200) {
              this.spinner.hide();
              Swal.fire({
                title: 'نجاح !!',
                text: response.msg,
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {
                this.getAllAddresses();
              });
            } else {
              this.spinner.hide();
              Swal.fire({
                title: 'خطأ !!',
                text: ` ${response.message}  !! `,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            }
          },
          (error) => {
            this.spinner.hide();
            if (error.status == 422) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.message,
                icon: 'error',
                confirmButtonText: 'موافق',
              }).then((result) => {
                this.getAllAddresses();
              });
            } else {
            }
          }
        );
      }
    });
  }

  //================================================
  countries: any[] = [];
  getAllCountries() {
    this._SharedService.getCountries().subscribe((response) => {
      this.countries = response.data;
    });
  }

  country_shipping_cost: any = 0;
  selectCountry(event: any) {
    this.visitorForm.patchValue({
      country_id: event.target.value,
    });

    this.countries.forEach((country: any) => {
      if (country.id == event.target.value) {
        this.country_shipping_cost = country.shipping_cost;
        if (this.checkLogin == 'false') {
          this.finalTotalPrice = this.cartTotal + this.country_shipping_cost;
          this.finalTotalDiscount = JSON.parse(
            sessionStorage.getItem('finalTotalDiscount') || '0'
          );
          this.finalTotalPrice =
            this.finalTotalPrice -
            (this.finalTotalDiscount / 100) * this.cartTotal;
        }
      }
    });
  }
  //================================================
  // begin:: visitor form
  visitorForm: FormGroup = new FormGroup({
    f_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    country_id: new FormControl(null, [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  submitVisitorForm(visitorForm: FormGroup) {
    if (visitorForm.value.country_id == null) {
      Swal.fire({
        title: 'تحذير !!',
        text: ' يجب اختيار المحافظة أولا ',
        icon: 'warning',
        confirmButtonText: 'موافق',
      }).then((result) => {
        $('#visitorModal').modal('hide');
      });
    } else {
      this.spinner.show();
      // if user delete [disabled]="registerForm.invalid" from html inspect
      if (visitorForm.invalid) {
        this.spinner.hide();
        Swal.fire({
          title: 'تحذير !!',
          text: 'يجب ملىء الفورم كاملة ',
          icon: 'warning',
          confirmButtonText: 'موافق',
        }).then((result) => {
          return;
        });
      } else {
        this.visitorForm.addControl(
          'notes',
          new FormControl(this.notes, Validators.required)
        );
        this.visitorForm.addControl(
          'payment_type',
          new FormControl(this.payment_type, Validators.required)
        );
        this.visitorForm.addControl(
          'visitor_id',
          new FormControl(this.visitor_id, Validators.required)
        );
        this.visitorForm.addControl(
          'coupon_code',
          new FormControl(this.coupon_code)
        );
        this._CartsService.placeOrder(this.visitorForm.value).subscribe(
          (response) => {
            if (response.status == 200) {
              $('#visitorModal').modal('hide');
              this.spinner.hide();
              let order_id = response.data.order_id;
              Swal.fire({
                title: 'نجاح !!',
                text: `تم الطلب بنجاح، كود طلبك ${order_id}
                يتم توصيل الطلب خلال 1-6 أيام، في حالة وجود أي مشكلة، برجاء التواصل مع الرقم التالي 01033334454 (9ص:5م).
                 شكرًا لثقتك في منتجات منظومة العباقرة 80فكرة
                `,
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                this.spinner.hide();
                sessionStorage.removeItem("copoun")
                this.getProductOnCart();
                this._Router.navigate(['/home']);
              });
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
    }
  }
  // end:: visitor form
  //================================================
}
