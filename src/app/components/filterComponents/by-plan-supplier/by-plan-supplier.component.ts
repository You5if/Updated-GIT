
import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../filter/filter.service';

import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'by-plan-supplier',
  templateUrl: './by-plan-supplier.component.html',
  styleUrls: ['./by-plan-supplier.component.scss']
})
export class ByPlanSupplierComponent implements OnInit {

  planSupplier!: string;

  constructor(
    private filter: FilterService,
  ) { }

  ngOnInit() {
    this.filter.myFilter.planSupplier = this.planSupplier;
  }

  onPlanSupplier() {
    if(this.planSupplier.length > 0) {
    this.filter.myFilter.planSupplier = this.planSupplier;
    }
    else {
      this.filter.myFilter.planSupplier = "''";
    }
  }

}
