import { CustomerapiService } from './../../../routes/customer/customerapi.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'wisk-suppliersearch',
  templateUrl: './wisksuppliersearch.component.html',
  styleUrls: ['./wisksuppliersearch.component.scss']
})
export class WisksuppliersearchComponent implements OnInit {


  companyValue;
  results;
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

  constructor(private customerApi: CustomerapiService) { }

  ngOnInit() {
  }

  search($event) {
    console.log($event);
    this.customerApi.getsupplier({ name: $event['query'] }).then(data => {
      console.log(data);
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
