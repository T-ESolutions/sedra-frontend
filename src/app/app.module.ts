import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
// import swiper
import { SwiperModule } from "swiper/angular";
// import spinner loader
import { NgxSpinnerModule } from "ngx-spinner";
// import toaster
import { ToastrModule } from 'ngx-toastr';
// import modules
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { MyIntercetor } from './intercetor';
import { PlyrModule } from 'ngx-plyr';
import { BarRatingModule } from 'ngx-bar-rating';
import { NgxLiteVimeoModule } from 'ngx-lite-video';




@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    RouterModule,
    ToastrModule,
    SharedModule,
    UserModule,
    AuthModule,
    ProductsModule,
    CartsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SwiperModule,
    PlyrModule,
    BarRatingModule,
    NgxLiteVimeoModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyIntercetor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
