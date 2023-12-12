import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { user } from 'src/app/models/user';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userPass: any = localStorage.getItem('userPass');
  constructor(
    private spinner: NgxSpinnerService,
    private _UserService: UserService,
    private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    $('.exit-icon').on('click', () => {
      // this.updateForm.reset();
      this.passwordForm.reset();
    });

    $('#forgetBtn').on('click', () => {
      $('#updatePasswordModal').modal('hide');
      $('#forgetPassModal').modal('show');
    });
    this.getData();
  }

  updateForm: FormGroup = new FormGroup({
    f_name: new FormControl('', [Validators.required]),
    // l_name: new FormControl("", [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    whats_app: new FormControl(''),
    email: new FormControl(''),
  });

  submitUpdateForm(updateForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (updateForm.invalid) {
      this.spinner.hide();
      return;
      // && updateForm.value.l_name == this.userData.l_name
    } else if (updateForm.value.f_name == this.userData.f_name) {
      this.spinner.hide();
      return;
    } else {
      this.updateForm.patchValue({
        phone: this.userData.phone,
        whats_app: this.userData.whats_app,
        email: this.userData.email,
      });
      this._UserService.updateProfile(updateForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'نجاح !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              this.getData();
            });
          } else {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
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

  // update email form
  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitEmailForm(emailForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (emailForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.updateEmail(emailForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            $('#verifyEmailModal').modal('show');
            localStorage.setItem('newEmail', emailForm.value.email);
          } else {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        },
        (error) => {
          if (error.status == 422) {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: 'قيمة حقل البريد الالكتروني مُستخدمة من قبل.',
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else {
            this.spinner.hide();
          }
        }
      );
    }
  }

  // update phone form
  phoneForm: FormGroup = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
  });

  // check phone number to update it
  submitPhoneForm(phoneForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (phoneForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.checkPhoneUpdate(phoneForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            $('#verifyPhoneModal').modal('show');
            localStorage.setItem('newNumber', phoneForm.value.phone);
          } else {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        },
        (error) => {
          if (error.status == 422) {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: 'قيمة حقل رقم الجوال مُستخدمة من قبل.',
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else {
            this.spinner.hide();
          }
        }
      );
    }
  }

  updatePassModal() {
    $('#updatePasswordModal').modal('show');
  }
  // update email form
  passwordForm: FormGroup = new FormGroup({
    old_password: new FormControl(null),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    password_confirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  submitPasswordForm(passwordForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (passwordForm.invalid) {
      this.spinner.hide();
      return;
    } else if (passwordForm.value.old_password != this.userPass) {
      this.spinner.hide();
      Swal.fire({
        confirmButtonColor: '#7A9987',
        title: 'موافق !!',
        text: 'كلمة المرور القديمة خطأ !!',
        icon: 'success',
        confirmButtonText: 'موافق',
      });
    } else {
      if (
        this.passwordForm.value.password !=
        this.passwordForm.value.password_confirmation
      ) {
        this.spinner.hide();
        Swal.fire({
          confirmButtonColor: '#7A9987',
          title: 'خطأ !!',
          text: 'كلمات المرور الجديدة يجب ان تكون متطابقة ',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      } else {
        this._UserService.changePassword(passwordForm.value).subscribe(
          (response) => {
            if (response.status == 200) {
              this.userData = response.data;
              this.spinner.hide();
              $('#updatePasswordModal').modal('hide');
              this.passwordForm.reset();
              Swal.fire({
                confirmButtonColor: '#7A9987',
                title: 'موافق !!',
                text: response.msg,
                icon: 'success',
                confirmButtonText: 'موافق',
              });
            } else {
              this.spinner.hide();
              Swal.fire({
                confirmButtonColor: '#7A9987',
                title: 'خطأ !!',
                text: 'خطأ غير معروف من الخادم !!',
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
  }

  //================================================
  // begin:: verify new email form
  code: any;
  verifyEmailData: any = { email: '', code: '' };
  verifyEmailForm: FormGroup = new FormGroup({
    code1: new FormControl(null, [Validators.required]),
    code2: new FormControl(null, [Validators.required]),
    code3: new FormControl(null, [Validators.required]),
    code4: new FormControl(null, [Validators.required]),
  });

  submitVerifyEmailForm(verifyEmailForm: FormGroup) {
    this.code = Number(
      `${verifyEmailForm.value.code1}${verifyEmailForm.value.code2}${verifyEmailForm.value.code3}${verifyEmailForm.value.code4}`
    );
    this.verifyEmailData.code = this.code;
    this.verifyEmailData.email = localStorage.getItem('newEmail');
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (verifyEmailForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.verifyEmailUpdated(this.verifyEmailData).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            this.verifyEmailForm.reset();
            $('#verifyEmailModal').modal('hide');
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'نجاح !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              this.getData();
            });
          } else {
            this.spinner.hide();
            this.verifyEmailForm.reset();
            $('#verifyEmailModal').modal('hide');
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        },
        (error) => {
          this.spinner.hide();
          $('#verifyEmailModal').modal('hide');
        }
      );
    }
  }
  // end verify new email form

  //================================================
  // begin:: verify new phone form
  verifyPhoneData: any = { phone: '', code: '' };
  verifyPhoneForm: FormGroup = new FormGroup({
    code1: new FormControl(null, [Validators.required]),
    code2: new FormControl(null, [Validators.required]),
    code3: new FormControl(null, [Validators.required]),
    code4: new FormControl(null, [Validators.required]),
  });

  submitVerifyPhoneForm(verifyPhoneForm: FormGroup) {
    this.code = Number(
      `${verifyPhoneForm.value.code1}${verifyPhoneForm.value.code2}${verifyPhoneForm.value.code3}${verifyPhoneForm.value.code4}`
    );
    this.spinner.show();
    this.verifyPhoneData.code = this.code;
    this.verifyPhoneData.phone = localStorage.getItem('newNumber');

    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (verifyPhoneForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._UserService.verifyPhoneUpdated(this.verifyPhoneData).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            this.verifyPhoneForm.reset();
            $('#verifyPhoneModal').modal('hide');
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'نجاح !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              this.getData();
            });
          } else {
            this.spinner.hide();
            this.verifyPhoneForm.reset();
            $('#verifyPhoneModal').modal('hide');
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        },
        (error) => {
          this.spinner.hide();
          $('#verifyPhoneModal').modal('hide');
        }
      );
    }
  }
  // end verify new phone form
  //================================================
  // this is the best method to handle the code inputs in angular
  move(e: any, p: any, c: any, n: any) {
    var length = c.value.length;
    var maxlength = c.getAttribute('maxlength');
    if (length == maxlength) {
      if (n != '') {
        n.focus();
      }
    }
    if (e.key == 'Backspace') {
      if (p != '') {
        p.focus();
      }
    }
  }

  userData!: user;
  // get profile data
  getData() {
    this.spinner.show();
    this._UserService.getProfileData().subscribe(
      (response) => {
        if (response.status == 200) {
          this.userData = response.data;
          this.updateForm.patchValue({
            f_name: this.userData.f_name,
          });
          this.emailForm.patchValue({
            email: this.userData.email,
          });
          this.phoneForm.patchValue({
            phone: this.userData.phone,
          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
          Swal.fire({
            confirmButtonColor: '#7A9987',
            title: 'خطأ !!',
            text: 'خطأ غير معروف من الخادم !!',
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

  visible: boolean = true;
  changeType: boolean = true;
  // this function to show and hide password
  viewPassword() {
    this.visible = !this.visible;
    this.changeType = !this.changeType;
  }

  // new updates and requirement

  // begin:: forget password form
  forgetPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  emailToForget: any = '';
  submitForgetPassForm(forgetPassForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (forgetPassForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._AuthService.forgetPassword(forgetPassForm.value).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            $('#forgetPassModal').modal('hide');
            this.emailToForget = forgetPassForm.value.email;
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'نجاح !!',
              text: ` تم إرسال كود التحقق الى البريد الإلكترونى :: ${forgetPassForm.value.email}`,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              $('#forgetPassVerifyModal').modal('show');
            });
          } else {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        },
        (error) => {
          if (error.status == 422) {
            this.spinner.hide();
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'خطأ !!',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          } else {
            this.spinner.hide();
          }
        }
      );
    }
  }
  // end:: forget password form
  // **************************************************************************
  // begin:: verify forget password form
  verifyForgetData: any = { email: '', code: '' };
  verifyForgetPassForm: FormGroup = new FormGroup({
    code1: new FormControl(null, [Validators.required]),
    code2: new FormControl(null, [Validators.required]),
    code3: new FormControl(null, [Validators.required]),
    code4: new FormControl(null, [Validators.required]),
  });

  submitVerifyForgetPassForm(verifyForgetPassForm: FormGroup) {
    this.code = Number(
      `${verifyForgetPassForm.value.code1}${verifyForgetPassForm.value.code2}${verifyForgetPassForm.value.code3}${verifyForgetPassForm.value.code4}`
    );
    this.verifyForgetData.code = this.code;
    this.verifyForgetData.email = this.emailToForget;
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (verifyForgetPassForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._AuthService.verifySignup(this.verifyForgetData).subscribe(
        (response) => {
          if (response.status == 200) {
            this.spinner.hide();
            this.verifyForgetPassForm.reset();
            $('#forgetPassVerifyModal').modal('hide');
            // localStorage.setItem("jwt" , response.data.jwt);
            localStorage.setItem('userData', JSON.stringify(response.data));
            Swal.fire({
              confirmButtonColor: '#7A9987',
              title: 'نجاح !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              $('#changePassModal').modal('show');
            });
          } else {
            this.spinner.hide();
            this.verifyForgetPassForm.reset();
            Swal.fire({
              confirmButtonColor: '#7A9987',
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
  // end:: verify forget password form
  // **************************************************************************
  // resend code
  resendForm: any = {
    email: '',
  };
  resendCode() {
    this.resendForm.email = this.emailToForget;
    this.spinner.show();
    this._UserService.resendCode(this.resendForm).subscribe((response) => {
      this.spinner.hide();
      Swal.fire({
        confirmButtonColor: '#7A9987',
        title: 'نجاح !!',
        text: ` تم إرسال كود التحقق الى البريد الإلكترونى :: ${this.resendForm.email}`,
        icon: 'success',
        confirmButtonText: 'موافق',
      });
    });
  }

  // **************************************************************************
  // begin:: change password form
  changePassForm: FormGroup = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    password_confirmation: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  submitChangePassForm(changePassForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (changePassForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      if (
        this.changePassForm.value.password !=
        this.changePassForm.value.password_confirmation
      ) {
        this.spinner.hide();
        Swal.fire({
          confirmButtonColor: '#7A9987',
          title: 'خطأ !!',
          text: 'كلمات المرور الجديدة يجب ان تكون متطابقة ',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      } else {
        this._UserService.changePassword(changePassForm.value).subscribe(
          (response) => {
            if (response.status == 200) {
              localStorage.setItem('jwt', response.data.jwt);
              localStorage.setItem('userData', JSON.stringify(response.data));
              this.spinner.hide();
              $('#changePassModal').modal('hide');
              this.changePassForm.reset();
              Swal.fire({
                confirmButtonColor: '#7A9987',
                title: 'موافق !!',
                text: 'تم تغيير كلمة المرور بنجاح.',
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {});
            } else {
              this.spinner.hide();
              Swal.fire({
                confirmButtonColor: '#7A9987',
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
  }
  // end:: change password form
}
