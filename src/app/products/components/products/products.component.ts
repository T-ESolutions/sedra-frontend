import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
declare const $: any;
// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  Pagination,
  Scrollbar,
  Navigation,
} from 'swiper';
import { ProductsService } from '../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Scrollbar, Navigation]);
import { CartSidebarComponent } from 'src/app/shared/components/cart-sidebar/cart-sidebar.component';
import { CartsService } from 'src/app/carts/services/carts.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {
  @ViewChild(CartSidebarComponent) private sidebarChild!: CartSidebarComponent;
  categoryId: number = 0;
  checkLogin: any = localStorage.getItem('checkLogin') || 'false';
  visitor_id: any = Number(sessionStorage.getItem('visitor_id'));
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProductsService: ProductsService,
    private spinner: NgxSpinnerService,
    private _CartsService: CartsService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = Number(
      this._ActivatedRoute.snapshot.params?.['categoryId']
    );
    this.getProductsByCategory(this.categoryId);
  }

  products: any[] = [];
  categories: any[] = [];
  // get products by category
  getProductsByCategory(id: any) {
    if (id == 0) {
      this.getAllCategoryProducts();
      this._Router.navigate([`/products/${id}`]);
    } else {
      this._Router.navigate([`/products/${id}`]);
      this.spinner.show();
      this._ProductsService.getProductsByCategory(id).subscribe(
        (response) => {
          if (response.status == 200) {
            this.categoryId = id;
            this.spinner.hide();
            this.products = response.data.products.data;
            this.categories = response.data.categories;
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

  // get all category products
  getAllCategoryProducts() {
    this.spinner.show();
    this._ProductsService.getAllCategoryProducts().subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.products = response.data.products.data;
          this.categories = response.data.categories;
          this.categoryId = 0;
          this._Router.navigate([`/products/${this.categoryId}`]);
        } else {
          this.spinner.hide();
          Swal.fire({
            title: 'خطأ !!',
            text: 'خطأ غير معروف من الخادم !!',
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

  productSentToCart: any = {
    product_id: 0,
    qty: 1,
  };

  addToCart(productId: number, quantity: number) {
    this.spinner.show();
    this.productSentToCart.product_id = productId;
    this.productSentToCart.qty = quantity;
    this._ProductsService.addToCart(this.productSentToCart).subscribe(
      (response) => {
        this.sidebarChild.getProductOnCart();
        this.getProductsByCategory(this.categoryId);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  // plus amount of product in your cart
  plusAmount(cartId: number, index: number) {
    this.spinner.show();
    this._CartsService.plusCart(cartId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          // this.getProductsByCategory(this.categoryId);
          this.products[index].qty_in_cart++;
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

  // minas amount of product in your cart
  minsAmount(cartId: number, index: number) {
    this.spinner.show();
    this._CartsService.minusCart(cartId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          // this.getProductsByCategory(this.categoryId);
          this.products[index].qty_in_cart--;
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
