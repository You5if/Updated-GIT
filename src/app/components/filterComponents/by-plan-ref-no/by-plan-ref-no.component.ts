
import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../filter/filter.service';

import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'by-plan-ref-no',
  templateUrl: './by-plan-ref-no.component.html',
  styleUrls: ['./by-plan-ref-no.component.scss']
})
export class ByPlanRefNoComponent implements OnInit {

  planRefNo!: string;

  constructor(
    private filter: FilterService,
  ) { }

  ngOnInit() {
    this.filter.myFilter.planRefNo = this.planRefNo;
  }

  onPlanRefNo() {
    if(this.planRefNo.length > 0) {
    this.filter.myFilter.planRefNo = this.planRefNo;
    }
    else {
      this.filter.myFilter.planRefNo = "''";
    }
  }

}
