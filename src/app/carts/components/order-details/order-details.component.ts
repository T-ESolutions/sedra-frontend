import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { CartsService } from '../../services/carts.service';
import { order } from 'src/app/models/order';
import { UserService } from 'src/app/user/services/user.service';

declare const $: any;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent {
  orderId: any = 1;
  constructor(
    private _UserService: UserService,
    private _ActivatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _CartsService: CartsService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this._ActivatedRoute.snapshot.params?.['orderId']);
    this.getOrderDetails(this.orderId);
    this.getAllAddresses();
  }

  order: order = {};
  orderNotes!: any;
  orderPaymentType!: any;
  getOrderDetails(orderId: any) {
    this.spinner.show();
    this._CartsService.getOrderDetails(orderId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.order = response.data;
          if (this.order.payment_type == 'cash') {
            this.orderPaymentType = 'كاش عند الإستلام';
          }

          if (this.order.notes == 'null') {
            this.orderNotes = '';
          } else {
            this.orderNotes = this.order.notes;
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

  cancelOrder(orderId: any) {
    this.spinner.show();
    this._CartsService.cancelOrder(orderId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          $('#orderState').addClass('d-none');
          $('#orderBtns').addClass('d-none');

          Swal.fire({
            title: 'نجاح !!',
            text: ' تم إلغاء الطلب بنجاح  ',
            icon: 'success',
            confirmButtonText: 'موافق',
          }).then((result) => {
            this._Router.navigate(['/my-orders']);
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

  showChangeAddressModalOnOrderDetails() {
    $('#changeAddressModalOnOrderDetails').modal('show');
  }

  hideChangeAddressModalOnOrderDetails() {
    $('#changeAddressModalOnOrderDetails').modal('hide');
  }

  addresses: any[] = [];
  getAllAddresses() {
    this.spinner.show();
    this._UserService.getAddresses().subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.addresses = response.data.data;
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

  changeChoosedAddress(e: any, addressId: any) {
    this.spinner.show();
    this._UserService.makeAddressDefault(addressId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.getAllAddresses();
      }
    });

    this._CartsService.changeOrderAddress(addressId, this.orderId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.getAllAddresses();
          this.getOrderDetails(this.orderId);
          $('#changeAddressModalOnOrderDetails').modal('hide');
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
}
