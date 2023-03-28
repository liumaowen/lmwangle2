import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {XmdcustomerService} from '../../xmdcustomer.service';

@Component({
  selector: 'app-xmdcustomerdetail',
  templateUrl: './xmdcustomerdetail.component.html',
  styleUrls: ['./xmdcustomerdetail.component.scss']
})
export class XmdCustomerdetailComponent implements OnInit {

  customerid = this.route.params['value']['id'];

  customer;

  constructor(private route: ActivatedRoute, private customerApi: XmdcustomerService) {
    console.log(this.route.params['value']['id']);
    this.customerApi.getCustomer(this.route.params['value']['id']).then((data) => {
      this.customer = data;
      console.log(data);
    });
  }

  ngOnInit() {
  }

}
