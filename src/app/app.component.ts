import { Component, OnInit, NgModule } from '@angular/core';
import disableDevtool from 'disable-devtool';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from './user/services/user.service';
import { user } from './models/user';
declare const $:any;
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DeviceUUID } from "device-uuid";
import { SharedService } from './shared/services/shared.service';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private spinner: NgxSpinnerService,
    private _SharedService: SharedService,
    private _AuthService:AuthService
  ) {
  }

  ngOnInit(): void {
    this.spinner.show();
    $(window).on('load', () => {
      this.spinner.hide();
    });

    // $(document).ready( () => {
    //     this.spinner.hide();
    // });
    // disableDevtool();
  }
}
