import { UserapiService } from './../../../dnn/service/userapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.scss']
})
export class UserdetailComponent implements OnInit {

  userid = this.route.params['value']['id'];
  user = {};

  constructor(private route: ActivatedRoute, private router: Router, private userApi: UserapiService) {
    this.userApi.get(this.route.params['value']['id']).then(data => {
      this.user = data;
      console.log(this.user);
    });
  }

  ngOnInit() {
  }

}
