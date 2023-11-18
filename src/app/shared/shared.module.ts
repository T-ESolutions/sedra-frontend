import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AppRoutingModule } from '../app-routing.module';
// import spinner loader
import { NgxSpinnerModule } from "ngx-spinner";
import { PageDetailsComponent } from './components/page-details/page-details.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    PageDetailsComponent,
    CartSidebarComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxSpinnerModule

  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    PageDetailsComponent,
    CartSidebarComponent
  ]
})
export class SharedModule { }
