import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
declare const $: any;
// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  Pagination,
  Scrollbar,
  Navigation,
} from 'swiper';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Scrollbar, Navigation]);
//import wowjs
import { NgwWowService } from 'ngx-wow';
import { ProductsService } from '../../services/products.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/user/services/user.service';
import { user } from 'src/app/models/user';
import { Router } from '@angular/router';
import { CartSidebarComponent } from 'src/app/shared/components/cart-sidebar/cart-sidebar.component';
import { CartsService } from 'src/app/carts/services/carts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DeviceUUID } from 'device-uuid';
import { AuthService } from 'src/app/auth/services/auth.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  events: any[] = ['slideInRight', 'slideInDown', 'slideInLeft', 'slideInUp'];
  checkLogin: any = localStorage.getItem('checkLogin') || 'false';
  visitor_id: any;
  constructor(
    private wowService: NgwWowService,
    private _ProductsService: ProductsService,
    private _SharedService: SharedService,
    private spinner: NgxSpinnerService,
    private _UserService: UserService,
    private _Router: Router,
    private _CartsService: CartsService,
    private _AuthService: AuthService
  ) {
    this.visitor_id = Number(sessionStorage.getItem('visitor_id'));
  }
  added: boolean = false;
  settings: any;
  all_category_image!: string;

  ngOnInit(): void {
    this.getVisitorId();
    this.getAllSettings();

    // this.firstLoad = localStorage.getItem('firstLoad');
    // this.wowService.init();
  }
  @ViewChild(CartSidebarComponent) private sidebarChild!: CartSidebarComponent;

  sliders: any[] = [
    {
      id: 0,
      image: '../../../../assets/images/icons/loader.gif',
      product_id: 0,
      url: '',
    },
  ];
  categories: any[] = [];
  products: any[] = [
    {
      id: 0,
      title: '',
      description: '',
      short_description: '',
      attributes: '',
      video_url: '',
      rate: 0,
      price: 0,
      discount: 0,
      price_after_discount: 0,
      categories: [],
      images: [],
      qty_in_cart: 0,
    },
  ];
  firstLoad!: any;
  // get home data
  getHomeData(visitor_id: any) {
    this.spinner.show();
    this._ProductsService.getHomeData(visitor_id).subscribe(
      (response) => {
        if (response.status == 200) {
          this.sliders = response.data.sliders;
          this.categories = response.data.categories;
          this.products = response.data.products;
          if (document.readyState !== 'loading') {
            this.spinner.hide();
          } else {
          }
        } else {
          this.spinner.hide();
          Swal.fire({
            confirmButtonColor: '#7A9987',
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
        this.getHomeData(this._AuthService.visitor_id);
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
          // this.getHomeData();
          this.products[index].qty_in_cart++;
        } else {
          this.spinner.hide();
          Swal.fire({
            confirmButtonColor: '#7A9987',
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
          // this.getHomeData();
          this.products[index].qty_in_cart--;
        } else {
          this.spinner.hide();
          Swal.fire({
            confirmButtonColor: '#7A9987',
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

  visitorForm: any = { unique_id: null };
  getVisitorId() {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load();

    (async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise;
      const result = await fp.get();
      this.visitorForm.unique_id = result.visitorId;
      this._SharedService
        .checkvisitor(this.visitorForm)
        .subscribe((response) => {
          sessionStorage.setItem('visitor_id', response.data.id);
          this._AuthService.visitor_id = response.data.id;
          sessionStorage.setItem('visitorData', JSON.stringify(response.data));
          this.getHomeData(response.data.id);
        });
    })();
  }

  getAllSettings() {
    this._SharedService.getSettings().subscribe((response) => {
      this.settings = response.data;
      // this.settings = JSON.parse(localStorage.getItem('settings') || '{}');
      this.all_category_image = this.settings[14].image as string;
    });
  }
}
