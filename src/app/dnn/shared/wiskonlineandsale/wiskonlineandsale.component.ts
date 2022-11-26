import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CustomerapiService } from './../../../routes/customer/customerapi.service';

@Component({
  selector: 'wisk-onlineandsale',
  templateUrl: './wiskonlineandsale.component.html',
  styleUrls: ['./wiskonlineandsale.component.scss']
})
export class WiskonlineandsaleComponent implements OnInit {

  customerValue;

  @Output() customerChange = new EventEmitter();

  @Input() disabled;

  @Input()

  get customer() {
    return this.customerValue;
  }
  set customer(val) {
    this.customerValue = val;
    this.customerChange.emit(this.customerValue);
  }

  constructor(private customerApi: CustomerapiService) { }

  ngOnInit() {
  }

  results;

  search($event) {
    const params = { search: $event['query'], isonline: '' ,salemanid: ''};
    this.customerApi.findonlineAndsalecustomer(params).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.company,
          code: element.id
        });
      });
    });
  }

}
