import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { BusinessorderapiService } from './../businessorderapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-businessorder',
  templateUrl: './businessorder.component.html',
  styleUrls: ['./businessorder.component.scss']
})
export class BusinessorderComponent implements OnInit {

  // 获取当前用户信息
  current = this.storage.getObject('cuser');
  search = { pagenum: 1, pagesize: 10, isonline: false, cuserid: this.current['id'] };
  singleData: any;
  totalItems: any;

  public currentPage: number = 1;

  constructor(public settings: SettingsService, private businessorderApi: BusinessorderapiService, private storage: StorageService,
    private orderApi: OrderapiService) {
    this.listDetail();
  }

  listDetail() {
    this.orderApi.query(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  ngOnInit() {
  }

  //分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

}
