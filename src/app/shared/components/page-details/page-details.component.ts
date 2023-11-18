import { Component, Input, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SharedService } from '../../services/shared.service';
import { page } from 'src/app/models/helper';
declare const $:any;
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent  implements OnInit  {
  clickEventSubscription!:Subscription;
  pageId:number = 1;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _SharedService:SharedService
  ) {
  }

  ngOnInit():void {
    this.pageId = Number(this._ActivatedRoute.snapshot.params?.["pageId"]);
    this.getPageDetails(this.pageId);

    this.clickEventSubscription = this._SharedService.getEvent().subscribe((res) => {
      this.getPageDetails(res)
    });
  };

  page:page = {};
  // get page details
  getPageDetails(id:any) {
    this.spinner.show();
    this._SharedService.getPageDetails(id).subscribe((response) => {
      if (response.status == 200) {
        this.spinner.hide();
        this.page = response.data;
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


  firstComponentFunction(){

  }
}
