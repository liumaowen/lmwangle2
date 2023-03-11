import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { CustomerapiService } from './../customerapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-zixin',
  templateUrl: './zixin.component.html',
  styleUrls: ['./zixin.component.scss']
})
export class ZixinComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  querys = { pagenum: 1, pagesize: 10 };

  zixin = {};

  constructor(private customerApi: CustomerapiService,
    private toast: ToasterService,
    private route: ActivatedRoute) {
    this.querydata();
  }

  ngOnInit() {
  }

  addzixin() {
    this.zixin = {};
    this.showclassicModal();
  }

  // 创建资信评价
  save() {
    // if (!this.zixin['zjshili'] && !this.zixin['companysize'] && !this.zixin['carnum'] && !this.zixin['paypinlv']) {
    //   this.toast.pop('warning', `至少选择一项！！！`);
    //   return;
    // }
    console.log(this.zixin);
    this.zixin['transcompanyid'] = this.route.parent.params['value']['id'];
    this.customerApi.createzixin(this.zixin).then(() => {
      this.hideclassicModal();
      this.querydata();
    });
  }

  // 查询时序表数据
  querydata() {
    this.querys['customerid'] = this.route.parent.params['value']['id'];
    this.customerApi.getzixinlist(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }


}
