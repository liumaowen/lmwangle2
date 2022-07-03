import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';

@Component({
  selector: 'app-customerdetail',
  templateUrl: './customerdetail.component.html',
  styleUrls: ['./customerdetail.component.scss']
})
export class CustomerdetailComponent implements OnInit {

  customerid = this.route.params['value']['id'];

  customer;

  constructor(private route: ActivatedRoute, private customerApi: CustomerapiService) {
    console.log(this.route.params['value']['id']);
    this.customerApi.getCustomer(this.route.params['value']['id']).then((data) => {
      this.customer = data;
      console.log(data);
    });
  }

  ngOnInit() {
  }

}
