import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { XmdapiService } from 'app/dnn/service/xmdapi.service';

@Component({
  selector: 'wisk-xmdcompanysearch',
  templateUrl: './xmdwiskcompanysearch.component.html',
  styleUrls: ['./xmdwiskcompanysearch.component.scss']
})
export class XmdiskcompanysearchComponent implements OnInit {

  companyValue;

  @Output()
  companyChange = new EventEmitter();
  @Output()
  public select = new EventEmitter<any>();

  @Input()
  get company() {
    return this.companyValue;
  }

  set company(val) {
    this.companyValue = val;
    this.companyChange.emit(this.companyValue);
  }

  @Input() isonline;

  constructor(private userapi: XmdapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    if (this.isonline === undefined) {
      this.userapi.searchCompany($event['query']).then(data => {
        this.results = [];
        data.json().forEach(element => {
          this.results.push({
            name: element.company,
            code: element.id
          });
        });
      });
    } else {
      const searchs = { isonline: this.isonline, search: $event['query'] };
      this.userapi.findcustomer(searchs).then(data => {
        this.results = [];
        data.json().forEach(element => {
          this.results.push({
            name: element.company,
            code: element.id,
            isonline: element.isonline
          });
        });
      });
    }
  }
  checkcompany(event) {
    this.select.emit(event);
  }

}
