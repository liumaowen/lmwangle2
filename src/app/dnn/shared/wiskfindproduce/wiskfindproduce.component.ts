import { CustomerapiService } from './../../../routes/customer/customerapi.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'wisk-findproduce',
  templateUrl: './wiskfindproduce.component.html',
  styleUrls: ['./wiskfindproduce.component.scss']
})
export class WiskfindproduceComponent implements OnInit {

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

  constructor(private customerApi: CustomerapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    const searchs = { search: $event['query'] };
    this.customerApi.findProduce(searchs).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.company,
          code: element.id
        });
      });
    });
  }
  checkcompany(event) {
    this.select.emit(event);
  }


}
