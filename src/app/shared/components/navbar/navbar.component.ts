import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
declare const $: any;
import Swal from 'sweetalert2';
import { SharedService } from '../../services/shared.service';
import { UserService } from 'src/app/user/services/user.service';
import { cartData } from 'src/app/models/cart';
import { ProductsService } from 'src/app/products/services/products.service';
import { interval } from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  visitor_id:any =  Number(sessionStorage.getItem('visitor_id'));
  cartLength:any = 0;
  checkLogin: any = localStorage.getItem('checkLogin') || 'false';
  constructor(private spinner: NgxSpinnerService , private _AuthService: AuthService, private _Router: Router, private _SharedService:SharedService, private _UserService:UserService, private _ProductsService:ProductsService) {
    // this function to show cart length on navbar , to avoid refresh
    const storage = interval(500).pipe(map(() => {
      this.cartLength = localStorage.getItem('cartLength');
      return  this.cartLength;
    }) )
    storage.subscribe(
      value => {
        this.cartLength = value;
      }
    )
  }

  ngOnInit(): void {
    this.visitor_id =  Number(sessionStorage.getItem('visitor_id'));
    $('.exit-icon').on('click', () => {
      this.loginForm.reset();
      this.signupForm.reset();
      this.forgetPassForm.reset();
      this.verifyForgetPassForm.reset();
      // this.verifySignUpForm.reset();
      this.changePassForm.reset();
    });
    this.getAllCountries();
  }
  //================================================
  // begin:: login form
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^.{5,25}$/),
    ]),
  });

  submitLoginForm(loginForm: FormGroup) {
    this.loginForm.patchValue({
      visitor_id:  this.visitor_id,

    })

    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (loginForm.invalid) {
      this.spinner.hide();
      Swal.fire({
        title: 'تحذير !!',
        text: "يجب ملىء الفورم كاملة ",
        icon: 'warning',
        confirmButtonText: 'موافق',
      }).then(result => {
        return;
      })
    } else {
      this._AuthService
        .signIn(loginForm.value).subscribe((response) => {
            if(response.status == 200) {
              this.spinner.hide();
              localStorage.setItem("userPass" , loginForm.value.password );
              sessionStorage.setItem("userPass", loginForm.value.password);
              this.loginForm.reset();
              $('#loginModal').modal('hide');$('#loginModal').modal('hide');
              localStorage.setItem("jwt" , response.data.jwt);
              sessionStorage.setItem("jwt", response.data.jwt);
              localStorage.setItem('userData',JSON.stringify( response.data));
              sessionStorage.setItem("userData", JSON.stringify( response.data));
              localStorage.setItem('checkLogin', 'true');
              sessionStorage.setItem("checkLogin", 'true');
              this.getProductOnCart();
              this._Router.navigate(['/home']);
              Swal.fire({
                title: 'نجاح !!',
                text:"تم تسجيل الدخول بنجاح",
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {
                this._Router.navigate(['/home']);
                window.location.reload();
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
          }, (error) => {
            this.spinner.hide();
            // Swal.fire({
            //   title: 'خطأ !!',
            //   text: 'خطأ غير معروف من الخادم !!',
            //   icon: 'error',
            //   confirmButtonText: 'موافق',
            // });
          });
    }
  }
  // end:: login form
  //================================================
  // begin:: signup form
  signupForm: FormGroup = new FormGroup({
    f_name: new FormControl("" , [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    // l_name: new FormControl("" , [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    country_id: new FormControl("" , [Validators.required]),
    phone: new FormControl("" , [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    whats_app: new FormControl("" , [Validators.minLength(11), Validators.maxLength(11)]),
    email: new FormControl("" , [Validators.required, Validators.email]),
    password: new FormControl("" , [
      Validators.required,
      Validators.pattern(/^.{5,25}$/),
    ]),
    password_confirmation: new FormControl("" , [

      Validators.pattern(/^.{5,25}$/),
    ]),

  });

  submitSignupForm(signupForm: FormGroup) {
    this.loginForm.patchValue({
      visitor_id:  this.visitor_id,

    })
    signupForm.value.password_confirmation = signupForm.value.password;
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (signupForm.invalid) {
      this.spinner.hide();
      Swal.fire({
        title: 'تحذير !!',
        text: "يجب ملىء الفورم كاملة ",
        icon: 'warning',
        confirmButtonText: 'موافق',
      }).then(result => {
        return;
      })
    } else {

      this._AuthService
      .signUp(signupForm.value).subscribe((response) => {
          if(response.status == 200) {
            localStorage.setItem("newEmail", signupForm.value.email);
            localStorage.setItem("userPass" , signupForm.value.password )
            this.spinner.hide();
            this.signupForm.reset();
            $('#signupModal').modal('hide');
            localStorage.setItem("jwt" , response.data.jwt);
            sessionStorage.setItem("jwt", response.data.jwt);
            localStorage.setItem('userData',JSON.stringify( response.data));
            sessionStorage.setItem("userData", JSON.stringify( response.data));
            localStorage.setItem('checkLogin', 'true');
            sessionStorage.setItem("checkLogin", 'true');
            this.getProductOnCart();
            this._Router.navigate(['/home']);
            Swal.fire({
              title: 'نجاح !!',
              text: "تم إنشاء الحساب بنجاح",
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              // $('#loginModal').modal('show');
              this._Router.navigate(['/home']);
              window.location.reload();
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
        }, (error) => {
          this.spinner.hide();
          if(error.status == 422) {
            if(error.error.errors.phone) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.errors.phone[0] ,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            } else if(error.error.errors.whats_app) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.errors.whats_app[0] ,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            } else if(error.error.errors.password) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.errors.password[0] ,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            } else if(error.error.errors.email) {
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.errors.email[0] ,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            }
          } else {
            this.spinner.hide();
            // Swal.fire({
            //   title: 'خطأ !!',
            //   text: 'خطأ غير معروف من الخادم !!',
            //   icon: 'error',
            //   confirmButtonText: 'موافق',
            // });
          }
        });
    }
  }
  // end:: signup form
    //================================================
  // begin:: verify sign up form
  code!: any;
  otp!:any;
  // verifyData: any = { email: "", code: "" };
  // verifySignUpForm: FormGroup = new FormGroup({
  //   code1: new FormControl(null, [Validators.required]),
  //   code2: new FormControl(null, [Validators.required]),
  //   code3: new FormControl(null, [Validators.required]),
  //   code4: new FormControl(null, [Validators.required]),
  // });

  // submitVerifySignUpForm(verifySignUpForm: FormGroup) {
  //   this.spinner.show();
  //   this.otp = Number(
  //     `${verifySignUpForm.value.code1}${verifySignUpForm.value.code2}${verifySignUpForm.value.code3}${verifySignUpForm.value.code4}`
  //   );
  //   this.verifyData.code = this.otp;
  //   this.verifyData.email = localStorage.getItem("newEmail");

  //   // if user delete [disabled]="registerForm.invalid" from html inspect
  //   if (verifySignUpForm.invalid) {
  //     this.spinner.hide();
  //     return;
  //   } else {
  //     this._AuthService
  //     .verifySignup(this.verifyData).subscribe((response) => {
  //         if(response.status == 200) {
  //           localStorage.setItem("jwt" , response.data.jwt);
  //           this.spinner.hide();
  //           this.verifySignUpForm.reset();
  //           $('#signupVerifyModal').modal('hide');
  //           Swal.fire({
  //             title: 'نجاح !!',
  //             text: response.msg,
  //             icon: 'success',
  //             confirmButtonText: 'موافق',
  //           }).then((result) => {
  //             /* Read more about isConfirmed, isDenied below */
  //             localStorage.setItem("jwt" , response.data.jwt);
  //             localStorage.setItem('userData',JSON.stringify( response.data));
  //             localStorage.setItem('checkLogin', 'true');
  //             this._Router.navigate(['/home']);
  //             window.location.reload();
  //           });
  //         } else {
  //           this.spinner.hide();
  //           this.verifySignUpForm.reset();
  //           Swal.fire({
  //             title: 'خطأ !!',
  //             text: response.msg,
  //             icon: 'error',
  //             confirmButtonText: 'موافق',
  //           });
  //         }
  //       }
  //       , (error) => {
  //         this.spinner.hide();
  //           // Swal.fire({
  //           //   title: 'خطأ !!',
  //           //   text: 'خطأ غير معروف من الخادم !!',
  //           //   icon: 'error',
  //           //   confirmButtonText: 'موافق',
  //           // });
  //       }
  //       );
  //   }
  // }
  // end:: verify sign up form
  //================================================
  // begin:: forget password form
  forgetPassForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  emailToForget:any = "";
  submitForgetPassForm(forgetPassForm: FormGroup) {
    this.spinner.show();
    // if user delete [disabled]="registerForm.invalid" from html inspect
    if (forgetPassForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this._AuthService.forgetPassword(forgetPassForm.value).subscribe((response) => {
            if(response.status == 200) {
              this.spinner.hide();
              $('#forgetPassModal').modal('hide');
              this.emailToForget = forgetPassForm.value.email;
              Swal.fire({
                title: 'نجاح !!',
                text:  ` تم إرسال كود التحقق الى البريد الإلكترونى :: ${forgetPassForm.value.email}`,
                icon: 'success',
                confirmButtonText: 'موافق',
              }).then((result) => {
                $('#forgetPassVerifyModal').modal('show');
              });
            } else {
              this.spinner.hide();
              Swal.fire({
                title: 'خطأ !!',
                text:  response.msg,
                icon: 'error',
                confirmButtonText: 'موافق',
              })
            }
          }, (error) => {
            if(error.status == 422 ) {
              this.spinner.hide();
              Swal.fire({
                title: 'خطأ !!',
                text: error.error.message,
                icon: 'error',
                confirmButtonText: 'موافق',
              });
            } else {
              this.spinner.hide();
              // Swal.fire({
              //   title: 'خطأ !!',
              //   text: 'خطأ غير معروف من الخادم !!',
              //   icon: 'error',
              //   confirmButtonText: 'موافق',
              // });
            }
          });
    }
  }
  // end:: forget password form
  //================================================
  // begin:: verify forget password form
  verifyForgetData: any = { email: "", code: "" };
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
      this._AuthService
      .verifySignup(this.verifyForgetData).subscribe((response) => {
          if(response.status == 200) {
            this.spinner.hide();
            this.verifyForgetPassForm.reset();
            $('#forgetPassVerifyModal').modal('hide');
            localStorage.setItem("jwt" , response.data.jwt);
            localStorage.setItem('userData',JSON.stringify( response.data));
            Swal.fire({
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
              title: 'خطأ !!',
              text: response.msg,
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        }
        , (error) => {
          this.spinner.hide();
            // Swal.fire({
            //   title: 'خطأ !!',
            //   text: 'خطأ غير معروف من الخادم !!',
            //   icon: 'error',
            //   confirmButtonText: 'موافق',
            // });
        }
        );
    }
  }
  // end:: verify forget password form
  //=============================================
  // begin:: change password form
  changePassForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
    password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
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
          title: 'خطأ !!',
          text: 'كلمات المرور الجديدة يجب ان تكون متطابقة ',
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      } else {
        this._UserService.changePassword(changePassForm.value).subscribe((response) => {
          if (response.status == 200) {
            localStorage.setItem("jwt" , response.data.jwt);
            localStorage.setItem('userData',JSON.stringify( response.data));
            this.spinner.hide();
            $("#changePassModal").modal("hide");
            this.changePassForm.reset();
            Swal.fire({
              title: 'موافق !!',
              text: response.msg,
              icon: 'success',
              confirmButtonText: 'موافق',
            }).then((result) => {
              $('#loginModal').modal('show');
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
        }, (error) => {
           this.spinner.hide();
            // Swal.fire({
            //   title: 'خطأ !!',
            //   text: 'خطأ غير معروف من الخادم !!',
            //   icon: 'error',
            //   confirmButtonText: 'موافق',
            // });
        })
      }
    }
  }
  // end:: change password form
  //================================================
  // begin:: sidebar
  openSideBar() {
    let homeSidebar: HTMLElement | null =
      document.getElementById('homeSidebar');
    homeSidebar && (homeSidebar.style.right = '0px');
  }

  closeSideBar() {
    let homeSidebar: HTMLElement | null =
      document.getElementById('homeSidebar');
    homeSidebar && (homeSidebar.style.right = '-100%');
  }
  // end:: sidebar
  //================================================
  visible: boolean = true;
  changeType: boolean = true;
  // this function to show and hide password
  viewPassword() {
    this.visible = !this.visible;
    this.changeType = !this.changeType;
  }
  //================================================
  // function of logout
  logOut() {
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم , أنا متأكد  ',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this._Router.navigate(['/home']);
        this._AuthService.logOut().subscribe(response => {
          if(response.status) {
            if(response.status == 200) {
              this.spinner.hide();
              //this._Router.navigate(['/navbar']);
              let visitor_id = Number(sessionStorage.getItem('visitor_id'));
              localStorage.clear();
              sessionStorage.clear();
              sessionStorage.setItem('visitor_id', JSON.stringify(visitor_id));
              window.location.reload();
            }
          } else if (response.message) {
            this.spinner.hide();
            Swal.fire({
              title: 'خطأ !!',
              text: ` ${response.message}  !!+1 `,
              icon: 'error',
              confirmButtonText: 'موافق',
            }).then((result) => {
              localStorage.clear();
              window.location.reload();
            });
          }
        }, (error) => {
          this.spinner.hide();
          // if(error.status == 401) {
          //   Swal.fire({
          //     title: 'خطأ !!',
          //     text:  ` ${error.error.message}  !! `,
          //     icon: 'error',
          //     confirmButtonText: 'موافق',
          //   }).then((result) => {
          //     localStorage.clear();
          //     window.location.reload();
          //   });
          // }else {
          //   Swal.fire({
          //     title: 'خطأ !!',
          //     text: 'خطأ غير معروف من الخادم !!',
          //     icon: 'error',
          //     confirmButtonText: 'موافق',
          //   }).then((result) => {
          //     localStorage.clear();
          //     window.location.reload();
          //   });
          // }
        })

      }
    });
  }

  //   تم تسجيل الخروج بنجاح
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

  //================================================
  countries:any[] = [];
  getAllCountries() {
    this._SharedService.getCountries().subscribe(response => {
      this.countries = response.data
    })
  }

  // resend code
  resendForm:any = {
    email : ""
  }
  resendCode() {
    this.resendForm.email = this.emailToForget
    this.spinner.show();
    this._UserService.resendCode(this.resendForm).subscribe((response) => {
      this.spinner.hide();
      Swal.fire({
        title: 'نجاح !!',
        text:  ` تم إرسال كود التحقق الى البريد الإلكترونى :: ${this.resendForm.email}`,
        icon: 'success',
        confirmButtonText: 'موافق',
      });
    })
  }

  // this function to store length of cart  on session storage
  cart!:cartData;
  getProductOnCart() {
    this.spinner.show();
    this._ProductsService.getProductOnCart().subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.cart = response.data;
        localStorage.setItem("cartLength", JSON.stringify(this.cart.cart.length));
      } else {
        this.spinner.hide();
        Swal.fire({
          title: 'خطأ !!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'موافق',
        });
      }
    }, (error) => {
      this.spinner.hide();
    })
  };
}
