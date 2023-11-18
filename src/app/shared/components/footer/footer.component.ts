import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { SharedService } from '../../services/shared.service';
import { settings } from 'src/app/models/helper';
import {Title} from "@angular/platform-browser";

declare const $:any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Output() childName: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private _Router: Router,
    private spinner: NgxSpinnerService,
    private _SharedService:SharedService,
    private titleService:Title
  ) {
  }

  ngOnInit():void {
    this.settings = [
      {
          id: 1,
          key: "site_name_ar",
          value: "",
          image: ""
      },
    ]
    this.getAllPages();
    this.getAllSettings();
  };

  pages:any[] = [];
  getAllPages() {
    this._SharedService.getPages().subscribe(response => {
      this.pages = response.data
    })
  }

  ourLogo:string = "";
  ourMail:string = "";
  ourMailImage:string = "";
  ourAddress:string = "";
  ourMessage:string="";
  ourFacebook:string="";
  ourYoutube:string="";
  ourInstagram:string="";
  ourTwitter:string="";
  ourFacebookImage:string="";
  ourYoutubeImage:string="";
  ourInstagramImage:string="";
  ourTwitterImage:string="";
  footerImage:string = "";
  settings!:settings;
  getAllSettings() {
    this._SharedService.getSettings().subscribe(response => {
      this.settings = response.data
      localStorage.setItem(
        'settings',
        JSON.stringify(this.settings)
      );
      let siteName:string = this.settings[0]?.['value'] as string;
      this.titleService.setTitle(siteName);
      this.ourLogo = this.settings[4]?.['image'] as string;
      this.ourMail = this.settings[3]?.['value'] as string;
      this.ourMailImage = this.settings[3]?.['image'] as string;
      this.ourAddress = this.settings[6]?.['value'] as string;
      this.ourMessage = this.settings[12]?.['value'] as string;
      this.ourFacebook = this.settings[8]?.['value'] as string;
      this.ourYoutube = this.settings[9]?.['value'] as string;
      this.ourInstagram = this.settings[10]?.['value'] as string;
      this.ourTwitter = this.settings[11]?.['value'] as string;
      this.ourFacebookImage = this.settings[8]?.['image'] as string;
      this.ourYoutubeImage = this.settings[9]?.['image'] as string;
      this.ourInstagramImage = this.settings[10]?.['image'] as string;
      this.ourTwitterImage = this.settings[11]?.['image'] as string;
      this.footerImage = this.settings[15]?.['image'] as string;
    })
  }


  getPageData(id:any) {
    this._SharedService.sendPageId(id)
  }
}
