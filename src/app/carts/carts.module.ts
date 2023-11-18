import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AppRoutingModule } from '../app-routing.module';
@NgModule({
  declarations: [
    CartComponent,
    CheckOutComponent,
    OrderDetailsComponent,
    EditOrderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    SwiperModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class CartsModule { }
