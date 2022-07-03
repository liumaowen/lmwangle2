import { MycustomerapiService } from './../mycustomerapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mycustomerdetail',
  templateUrl: './mycustomerdetail.component.html',
  styleUrls: ['./mycustomerdetail.component.scss']
})
export class MycustomerdetailComponent implements OnInit {

  customerid = this.route.params['value']['id'];

  customer;

  constructor(private route: ActivatedRoute,
    private mycustomerApi: MycustomerapiService) {
    this.mycustomerApi.getCustomer(this.route.params['value']['id']).then((data) => {
      this.customer = data.json();
      // $scope.customer = data;
    });
  }

  ngOnInit() {
  }

}
