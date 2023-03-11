import { QualityService } from './../quality.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.scss']
})
export class QualityComponent implements OnInit {
  @ViewChild('querydialog') private querydialog: ModalDirective;
  search = {pagenum: 1, pagesize: 10, customerid: '', sellerid: ''};
  // 获取的表格数据，并显示页面
  singleData = [];
  public totalItems: number;
  public currentPage = 1;
  buyer: any; // 买方
  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.getlist();
  }
  constructor(private service: QualityService, private toaster: ToasterService) {
    this.getlist();
  }

  ngOnInit() {
  }
  getlist() {
    console.log('search', this.search);
    this.service.query(this.search).then(data => {
      console.log(data);
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      this.singleData = data.json();
    });
  }
  open() {
    this.search = {pagenum: 1, pagesize: 10, customerid: '', sellerid: ''};
    this.querydialog.show();
  }
  // 卖方公司
  innercompany(event) {
    this.search['sellerid'] = event;
  }
  query() {
    if (this.buyer) {
      this.search['customerid'] = this.buyer['code'];
    }
    this.getlist();
    this.queryclose();
  }
  queryclose() {
    this.querydialog.hide();
  }
}
