import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../services/user.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { address } from 'src/app/models/helper';
declare const $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {
  addressId: number = 1;
  constructor(
    private _SharedService: SharedService,
    private _UserService: UserService,
    private spinner: NgxSpinnerService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addressId = Number(
      this._ActivatedRoute.snapshot.params?.['addressId']
    );
    this.getAddressDetails(this.addressId);
    this.getAllCountries();
  }

  address: address = {
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

  // get address details
  getAddressDetails(id: any) {
    this.spinner.show();
    this._UserService.getAddressDetails(id).subscribe(
      (response) => {
        if (response.status == 200) {
          this.address = response.data;
          this.updateAddressForm.patchValue({
            address: this.address.address,
            f_name: this.address.f_name,
            // l_name:  this.address.l_name,
            phone: this.address.phone,
            country_id: this.address.country_id,
            city_id: this.address.city_id,
            // email:  this.address.email,
            id: this.address.id,
          });
          this.spinner.hide();
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

  updateAddressForm: FormGroup = new FormGroup({
    address: new FormControl('', [Validators.required]),
    f_name: new FormControl('', [Validators.required]),
    // l_name: new FormControl("", [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    country_id: new FormControl('', [Validators.required]),
    city_id: new FormControl('', [Validators.required]),
    // email: new FormControl("", [Validators.required]),
    id: new FormControl('', [Validators.required]),
  });

  submitUpdateAddressForm(updateAddressForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (updateAddressForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.updateAddress(updateAddressForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            Swal.fire({
              title: 'نجاح !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              this.getAddressDetails(this.addressId);
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
  }

  countries: any[] = [];
  getAllCountries() {
    this._SharedService.getCountries().subscribe((response) => {
      this.countries = response.data;
    });
  }
}
