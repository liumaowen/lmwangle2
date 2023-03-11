import { ProduceapiService } from './../produceapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myproduce',
  templateUrl: './myproduce.component.html',
  styleUrls: ['./myproduce.component.scss']
})
export class MyproduceComponent implements OnInit {

  totalItems: any;

  singleData;

  search = { pagenum: 1, pagesize: 10 };


  public currentPage: number = 1;

  constructor(private produceApi: ProduceapiService, private toast: ToasterService) {
    this.listDetail();
  }

  listDetail() {
    this.produceApi.query(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

  ngOnInit() {
  }

}
