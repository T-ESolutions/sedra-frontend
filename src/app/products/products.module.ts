import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { SharedModule } from '../shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
import { NgwWowModule } from 'ngx-wow';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { SafePipe } from '../pipes/safe.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    ProductsComponent,
    ProductDetailsComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    SwiperModule,
    RouterModule,
    NgwWowModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule


  ]
})
export class ProductsModule { }
