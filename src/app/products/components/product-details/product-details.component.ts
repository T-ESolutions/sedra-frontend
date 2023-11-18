import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
declare const $: any;
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
// import Swiper core and required modules
import SwiperCore, {
  Autoplay,
  Pagination,
  Scrollbar,
  Navigation,
  Thumbs,
} from 'swiper';
import { ProductsService } from '../../services/products.service';
import { cart, product } from 'src/app/models/product';
import { cartData } from 'src/app/models/cart';
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Scrollbar, Navigation, Thumbs]);
// import * as Plyr from 'plyr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// var Plyr = require("plyr");
import { Location } from '@angular/common';
import { CartSidebarComponent } from 'src/app/shared/components/cart-sidebar/cart-sidebar.component';
import { CartsService } from 'src/app/carts/services/carts.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild(CartSidebarComponent) private sidebarChild!: CartSidebarComponent;
  // vimeoUrl = 'https://vimeo.com/197933516';
  // youtubeUrl = 'https://www.youtube.com/watch?v=iHhcHTlGtRs';
  // dailymotionUrl =
  //   'https://www.dailymotion.com/video/x20qnej_red-bull-presents-wild-ride-bmx-mtb-dirt_sport';

  // vimeoId = '197933516';
  // youtubeId = 'iHhcHTlGtRs';
  // dailymotionId = 'x20qnej';

  // /********* */
  // iframe_html: any;
  // youtubeUrl = "https://www.youtube.com/watch?v=iHhcHTlGtRs";
  /********************************* */
  thumbsSwiper: any;
  quantity: number = 1;
  productId: number = 1;
  checkLogin: any = sessionStorage.getItem('checkLogin') || 'false';
  visitor_id: any = Number(sessionStorage.getItem('visitor_id'));
  currentRate = 6;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ProductsService: ProductsService,
    private spinner: NgxSpinnerService,
    private _sanitizer: DomSanitizer,
    private location: Location,
    private _CartsService: CartsService
  ) {
    // this.iframe_html = this.embedService.embed(this.youtubeUrl , {
    //   query: { portrait: 0, color: '333' },
    //   attr: { width: 500, height: 300 }
    // });
    // this.cart = {
    //   cart: [],
    //   total: 0,
    //   shipping: 0,
    //   discount: 0
    // }
  }

  // public player:any;
  // public controls = [
  //   'play-large', // The large play button in the center
  //   'restart', // Restart playback
  //   'rewind', // Rewind by the seek time (default 10 seconds)
  //   'play', // Play/pause playback
  //   'fast-forward', // Fast forward by the seek time (default 10 seconds)
  //   'progress', // The progress bar and scrubber for playback and buffering
  //   'current-time', // The current time of playback
  //   'duration', // The full duration of the media
  //   'mute', // Toggle mute
  //   'volume', // Volume control
  //   'captions', // Toggle captions
  //   'settings', // Settings menu
  //   'pip', // Picture-in-picture (currently Safari only)
  //   'airplay', // Airplay (currently Safari only// Show a download button with a link to either the current source or a custom URL you specify in your options
  //   'fullscreen' // Toggle fullscreen
  // ];
  ngOnInit(): void {
    this.productId = Number(
      this._ActivatedRoute.snapshot.params?.['productId']
    );
    this.getProductDetails(this.productId);
    this.getRelatedProducts(this.productId);
    // review logic
    $('#test').on('click', () => {
      $('input[type="radio').val(0);
    });
  }

  ngAfterViewInit(): void {}

  product: product = {};
  reviews: any = [];
  producImages: any;
  finalUrl: string = '';
  // get product details
  getProductDetails(id: any) {
    this.spinner.show();
    this._ProductsService.getProductDetails(id).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.product = response.data.product;
          this.reviews = response.data.reviews;
          this.producImages = response.data.product.images;
          this.finalUrl = `${this.product.video_url}`;
          this.reviewForm.patchValue({
            product_id: this.product.id,
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

  // get related products for every product
  relatedProducts: any[] = [];
  getRelatedProducts(id: any) {
    this.spinner.show();
    this._ProductsService.getRelatedProducts(id).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.relatedProducts = response.data.data;
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

  productToCart: any = {
    product_id: this.productId,
    qty: 1,
  };

  productsOnCart: any[] = [];
  // add product to cart
  addToCart() {
    this.spinner.show();
    this.productToCart.product_id = Number(
      this._ActivatedRoute.snapshot.params?.['productId']
    );
    this.productToCart.qty = this.quantity;
    this._ProductsService.addToCart(this.productToCart).subscribe(
      (response) => {
        if (response.status == 200) {
          // this._ProductsService.orderProductsOnCart();
          this.sidebarChild.getProductOnCart();
          this.getProductDetails(this.productId);
          this.spinner.hide();
          // this.getProductOnCart()
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

  addToCartBeforeLogin() {
    Swal.fire({
      title: 'خطأ !!',
      text: 'يجب تسجيل الدخول اولا ',
      icon: 'warning',
      confirmButtonText: 'موافق',
    }).then((result) => {
      $('#loginModal').modal('show');
    });
  }

  reviewForm: FormGroup = new FormGroup({
    product_id: new FormControl(this.productId),
    rate: new FormControl(null, [Validators.required]),
    comment: new FormControl(''),
  });

  submitReviewForm(reviewForm: FormGroup) {
    this.reviewForm.patchValue({
      product_id: this.productId,
    });

    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (reviewForm.invalid) {
      return;
    } else {
      let check = sessionStorage.getItem('checkLogin');
      if (check != 'true') {
        Swal.fire({
          title: 'خطأ !!',
          text: 'يجب تسجيل الدخول اولا ',
          icon: 'warning',
          confirmButtonText: 'موافق',
        }).then(() => {
          this.reviewForm.reset();
        });
      } else {
        this.spinner.show();
        this._ProductsService.addReview(reviewForm.value).subscribe(
          (response) => {
            if (response.status == 200) {
              this.spinner.hide();
              Swal.fire({
                title: 'نجاح !!',
                text: response.msg,
                icon: 'success',
                confirmButtonText: 'موافق',
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
            if (error.status == 401) {
              this.spinner.hide();
              Swal.fire({
                title: 'خطأ !!',
                text: 'لم يتم اضافة التقيم - تم التقييم من قبل بالفعل',
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            } else {
              this.spinner.hide();
            }
          }
        );

        this.reviewForm.reset();
      }
    }
  }

  currentRoute!: string;
  copyUrl() {
    this.currentRoute = window.location.href;
    navigator.clipboard.writeText(this.currentRoute);
    Swal.fire({
      title: 'نجاح !!',
      text: 'تم نسخ الرابط بنجاح  ',
      icon: 'success',
      confirmButtonText: 'موافق',
    });
  }

  goBack() {
    this.location.back();
  }

  // plus amount of product in your cart
  plusAmount(cartId: number) {
    this.spinner.show();
    this._CartsService.plusCart(cartId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          let qtyOnCart: any = document.getElementById(
            'qtyOnCart'
          ) as HTMLInputElement | null;
          qtyOnCart.value++;
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
  minsAmount(cartId: number) {
    this.spinner.show();
    this._CartsService.minusCart(cartId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          let qtyOnCart: any = document.getElementById(
            'qtyOnCart'
          ) as HTMLInputElement | null;
          qtyOnCart.value--;
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

  slide: any;
  showEnlargImg(slide: any) {
    this.slide = slide;
    $('#myLargeModalLabel').modal('show');
  }
}
