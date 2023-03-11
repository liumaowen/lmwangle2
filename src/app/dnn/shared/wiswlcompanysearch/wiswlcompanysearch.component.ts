import { CustomerapiService } from './../../../routes/customer/customerapi.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'wis-wiswlcompanysearch',
  templateUrl: './wiswlcompanysearch.component.html',
  styleUrls: ['./wiswlcompanysearch.component.scss']
})
export class WiswiswlcompanysearchComponent implements OnInit {


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

  constructor(private customerapi: CustomerapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    const searchs = { name: $event['query'] };
    this.customerapi.findwlsearch(searchs).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.name,
          code: element.id
        });
      });
    });
  }
  checkcompany(event) {
    this.select.emit(event);
  }


}
