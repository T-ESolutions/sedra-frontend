import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressComponent } from './components/address/address.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { SharedModule } from '../shared/shared.module';
import { NgwWowModule } from 'ngx-wow';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { EditAddressComponent } from './components/edit-address/edit-address.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AppRoutingModule } from '../app-routing.module';
@NgModule({
  declarations: [
    ProfileComponent,
    AddressComponent,
    MyOrdersComponent,
    EditAddressComponent
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
export class UserModule { }
