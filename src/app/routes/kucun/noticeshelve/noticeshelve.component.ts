import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Http } from '@angular/http';

@Component({
  selector: 'app-noticeshelve',
  templateUrl: './noticeshelve.component.html',
  styleUrls: ['./noticeshelve.component.scss']
})
export class NoticeshelveComponent implements OnInit {
  totalItems: any;

  singleData;

  search = { pageNum: 1, pageSize: 10 };


  public currentPage = 1;

  constructor(
    private toast: ToasterService,
    private http: Http,
  ) { }

  ngOnInit() {
    this.listDetail();
  }
  listDetail() {
    this.http.get(`store/api/offonshelve/pageFind`, { search: this.search }).subscribe(data => {
      const params = data.json();
      // 获取到当前数据
      this.singleData = params.offOnShelves;
      // 获取到总条目
      this.totalItems = params.total;
      console.log(this.singleData);
    });
  }
   // 分页点击查询
   pageChanged(event: any): void {
    this.search['pageNum'] = event.page;
    this.search['pageSize'] = event.itemsPerPage;
    this.listDetail();
  }

}
