import { BusinessorderapiService } from './../../../routes/businessorder/businessorderapi.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'wisk-findbysale',
  templateUrl: './wiskfindbysale.component.html',
  styleUrls: ['./wiskfindbysale.component.scss']
})
export class WiskfindbysaleComponent implements OnInit {

  companyValue;

  @Output()
  companyChange = new EventEmitter();
  @Output()
  public select = new EventEmitter<any>();
  @Input()
  get company() {
    if (this.companyValue) {
      return this.companyValue;
    } else {
      return '';
    }
  }

  set company(val) {
    this.companyValue = val;
    this.companyChange.emit(this.companyValue);
  }

  @Input() isonline;

  constructor(private businessorderApi: BusinessorderapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    const searchs = { search: $event['query'] };
    this.businessorderApi.companysearch(searchs).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.company,
          code: element.id,
          isonline: element.isonline
        });
      });
    });
  }
  checkcompany(event) {
    this.select.emit(event);
  }


}
