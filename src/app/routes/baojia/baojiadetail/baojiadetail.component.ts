import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaojiaService} from "../baojia.service";

@Component({
  selector: 'app-baojiadetail',
  templateUrl: './baojiadetail.component.html',
  styleUrls: ['./baojiadetail.component.scss']
})
export class BaojiadetailComponent implements OnInit {

  cuid:any;
  model:any;
  review:string;

  constructor(private route: ActivatedRoute,private baojiaApi:BaojiaService,private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cuid = params.id;
      this.baojiaApi.getBaojia(params.id).then(data=>{
        this.model = data;
        this.review = JSON.stringify(data.reviews);
      })
    });
  }

  delet(){
    console.log("这是删除方法");
    this.baojiaApi.deletBaojia(this.cuid).then(data=>{
      console.log(data);
      this.router.navigateByUrl('baojia',1);
    })
  }

  vorunv(){
    console.log("这是停启动按钮");
    this.baojiaApi.vorunvBaojia(this.cuid).then(data=>{
      console.log(data);
      this.router.navigateByUrl('baojia',1);
    });
  }

}
