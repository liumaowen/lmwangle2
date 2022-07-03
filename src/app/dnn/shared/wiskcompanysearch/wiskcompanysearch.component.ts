import { element } from 'protractor';
import { UserapiService } from './../../service/userapi.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'wisk-companysearch',
  templateUrl: './wiskcompanysearch.component.html',
  styleUrls: ['./wiskcompanysearch.component.scss']
})
export class WiskcompanysearchComponent implements OnInit {

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

  constructor(private userapi: UserapiService) { }

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
