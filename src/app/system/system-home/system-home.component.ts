
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-system-home',
  templateUrl: './system-home.component.html',
  styleUrls: ['./system-home.component.scss']
})
export class SystemHomeComponent implements OnInit {

  constructor(
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Welcome - GIS");
    console.log("*\n**\n***\n****")
    console.log("****\n***\n**\n*")
    console.log("   *\n  * *\n * * *\n* * * *")
  }

}
