import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartsService } from 'src/app/carts/services/carts.service';
import { ProductsService } from 'src/app/products/services/products.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
declare const $: any;

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent {
  constructor(
    private _ProductsService: ProductsService,
    private spinner: NgxSpinnerService,
    private _CartsService: CartsService,
    private _UserService: UserService
  ) {}
  ngOnInit(): void {
    this.getAllOrders();
  }

  currentOrders: any[] = [];
  previousOrders: any[] = [];
  getAllOrders() {
    this.spinner.show();
    this._UserService.getOrders('current').subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.currentOrders = response.data.data;
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

    // get previous orders
    this._UserService.getOrders('previous').subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.previousOrders = response.data.data;
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
