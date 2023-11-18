import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;
import Swal from 'sweetalert2';
import { address } from 'src/app/models/helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  constructor(
    private _SharedService: SharedService,
    private _UserService: UserService,
    private spinner: NgxSpinnerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    $('#closeBtn').on('click', function () {
      $('#confirm-add-location-modal').modal('hide');
    });

    this.getAllAddresses();
    this.getAllCountries();
  }

  detectChanges(event: any) {
    this.getAllCities(event.target.value);
  }

  countries: any[] = [];
  getAllCountries() {
    this._SharedService.getCountries().subscribe((response) => {
      this.countries = response.data;
    });
  }

  cities: any[] = [];
  getAllCities(id: any) {
    this._SharedService.getCities(id).subscribe((response) => {
      this.cities = response.data;
    });
  }

  basicAddress: address = {
    id: 0,
    address: '',
    f_name: '',
    // l_name: "",
    phone: '',
    country_id: 0,
    country_title: '',
    city_id: 0,
    city_title: '',
    city_shipping_cost: 0,
    email: '',
    is_default: 0,
  };
  addresses: any[] = [];
  // get all addresses
  getAllAddresses() {
    this.spinner.show();
    this._UserService.getAddresses().subscribe(
      (response) => {
        if (response.status == 200) {
          this.spinner.hide();
          this.addresses = response.data.data;
          for (var i = 0; i <= this.addresses.length; i++) {
            if (this.addresses[i]?.is_default == 1) {
              this.basicAddress = this.addresses[i];
              return;
            } else {
              this.basicAddress.is_default = 0;
            }
          }
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

  deleteAddress(addressId: any) {
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد حذف العنوان؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم , أنا متأكد  ',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this._UserService.deleteAddress(addressId).subscribe(
          (response) => {
            if (response.status == 200) {
              this.spinner.hide();
              Swal.fire({
                title: 'نجاح !!',
                text: response.msg,
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {
                this.getAllAddresses();
              });
            } else {
              this.spinner.hide();
              Swal.fire({
                title: 'خطأ !!',
                text: ` ${response.message}  !! `,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            }
          },
          (error) => {
            this.spinner.hide();
            if (error.status == 422) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.message,
                icon: 'error',
                confirmButtonText: 'موافق',
              }).then((result) => {
                this.getAllAddresses();
                // window.location.reload();
              });
            } else {
              // Swal.fire({
              //   title: 'خطأ !!',
              //   text: 'خطأ غير معروف من الخادم !!',
              //   icon: 'error',
              //   confirmButtonText: 'موافق',
              // }).then((result) => {
              //   this.getAllAddresses();
              //   // window.location.reload();
              // });
            }
          }
        );
      }
    });
  }

  // make address default
  makeDefault(addressId: any, checkValue: any) {
    this.spinner.show();
    this._UserService.makeAddressDefault(addressId).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.getAllAddresses();
      }
    });
  }

  // begin:: login form
  addAddressForm: FormGroup = new FormGroup({
    address: new FormControl(null, [Validators.required]),
    f_name: new FormControl('', [Validators.required]),
    // l_name: new FormControl("" , [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    country_id: new FormControl('', [Validators.required]),
    // email: new FormControl("" , [Validators.required, Validators.email]),
  });

  submitAddAddressForm(addAddressForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (addAddressForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.addAddress(addAddressForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            this.addAddressForm.reset();
            $('#confirm-add-location-modal').modal('hide');
            Swal.fire({
              title: 'نجاح !!',
              text: 'تم إضافة عنوان جديد',
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              this.getAllAddresses();
            });
          } else {
            this.spinner.hide();
            Swal.fire({
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              this.addAddressForm.reset();
              $('#confirm-add-location-modal').modal('hide');
            });
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }

  goBack() {
    this.location.back();
  }
}
