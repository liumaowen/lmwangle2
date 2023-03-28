import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { XmdcustomerService } from 'app/routes/xmd/customer/xmdcustomer.service';

@Component({
  selector: 'wisk-xmdsuppliersearch',
  templateUrl: './xmdwisksuppliersearch.component.html',
  styleUrls: ['./xmdwisksuppliersearch.component.scss']
})
export class XmdWisksuppliersearchComponent implements OnInit {


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

  constructor(private customerApi: XmdcustomerService) { }

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
