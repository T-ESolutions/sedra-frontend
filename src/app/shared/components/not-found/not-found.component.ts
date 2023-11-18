import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
declare const $:any;
declare var bootstrap: any;

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit{
  checkLogin: any = sessionStorage.getItem('checkLogin');
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private location: Location
  ) {

  }


  ngOnInit():void {

  }

}
