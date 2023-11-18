import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth.guard';
import { CartComponent } from './carts/components/cart/cart.component';
import { CheckOutComponent } from './carts/components/check-out/check-out.component';
import { EditOrderComponent } from './carts/components/edit-order/edit-order.component';
import { OrderDetailsComponent } from './carts/components/order-details/order-details.component';
import { HomeComponent } from './products/components/home/home.component';
import { ProductDetailsComponent } from './products/components/product-details/product-details.component';
import { ProductsComponent } from './products/components/products/products.component';
import { AddressComponent } from './user/components/address/address.component';
import { EditAddressComponent } from './user/components/edit-address/edit-address.component';
import { MyOrdersComponent } from './user/components/my-orders/my-orders.component';
import { ProfileComponent } from './user/components/profile/profile.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PageDetailsComponent } from './shared/components/page-details/page-details.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {path: "" , redirectTo: "home" , pathMatch: "full"},
  {path: "home" , component: HomeComponent},
  {path: "navbar" , component: NavbarComponent},
  {path: "products/:categoryId" , component: ProductsComponent},
  {path: "product-details/:productId" , component: ProductDetailsComponent},
  {path: "cart" , component: CartComponent},
  {path: "check-out" , component: CheckOutComponent},
  {path: "edit-order" , component: EditOrderComponent, canActivate:[AuthGuard]},
  {path: "order-details/:orderId" , component: OrderDetailsComponent, canActivate:[AuthGuard]},
  {path: "profile" , component: ProfileComponent, canActivate:[AuthGuard]},
  {path: "address" , component: AddressComponent, canActivate:[AuthGuard]},
  {path: "edit-address/:addressId" , component: EditAddressComponent, canActivate:[AuthGuard]},
  {path: "my-orders" , component: MyOrdersComponent, canActivate:[AuthGuard]},
  {path: "page-details/:pageId" , component: PageDetailsComponent},
  {path: "not-found" , component: NotFoundComponent},
  {path: "**" , redirectTo: "home" , pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
