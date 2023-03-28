import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { XmdBusinessorderapiService } from 'app/routes/xmd/order/xmdbusinessorderapi.service';

@Component({
  selector: 'wisk-xmdfindbysale',
  templateUrl: './xmdwiskfindbysale.component.html',
  styleUrls: ['./xmdwiskfindbysale.component.scss']
})
export class XmdwiskfindbysaleComponent implements OnInit {

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

  constructor(private xmdbusinessorderApi: XmdBusinessorderapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    const searchs = { search: $event['query'] };
    this.xmdbusinessorderApi.companysearch(searchs).then(data => {
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
