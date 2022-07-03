import { CustomerapiService } from './../../../routes/customer/customerapi.service';
import { UserapiService } from './../../service/userapi.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'wisk-customersearch',
  templateUrl: './wiskcustomersearch.component.html',
  styleUrls: ['./wiskcustomersearch.component.scss']
})
export class WiskcustomersearchComponent implements OnInit {

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
    const params = { search: $event['query'], isonline: '' };
    this.customerApi.findAllbyname(params).then(data => {
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
