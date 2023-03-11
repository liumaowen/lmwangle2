import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PriceapiService } from './../priceapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pricelog',
  templateUrl: './pricelog.component.html',
  styleUrls: ['./pricelog.component.scss']
})
export class PricelogComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  cuser;

  vuser;

  activating = false;


  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  search: object = { pagenum: 1, pagesize: 10 };

  constructor(private pricelogApi: PriceapiService,
    private router: Router,
    private toast: ToasterService) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  querydata() {
    this.pricelogApi.pageList(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 重置条件
  selectNull() {
    this.search = { pagenum: 1, pagesize: 10 };
    this.cuser = undefined;
    this.vuser = undefined;
  }

  // 查询按钮
  query() {
    if (typeof (this.cuser) === 'object') {
      this.search['cuserid'] = this.cuser['code'];
    } else {
      this.search['cuserid'] = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.search['vuserid'] = this.vuser['code'];
    } else {
      this.search['vuserid'] = '';
    }
    this.querydata();
  }

  // 删除没有审核的记录
  removeLod(pricelogid) {
    if (confirm('你确定删除吗？')) {
      this.pricelogApi.remove(pricelogid).then(() => {
        this.toast.pop('success', '删除成功');
        this.querydata();
      })
    }
  }

  // 重新定价
  rePirce(pricelogid) {
    if (confirm('你确定重新定价吗？')) {
      const templog = {};
      templog['isdel'] = true;
      templog['pricelogid'] = 0;
      templog['isv'] = true;
      this.router.navigate(['pricelogdet', pricelogid], { queryParams: templog });
      // $state.go('app.pricelogdet', {
      //   pricelogid: pricelogid,
      //   params: templog
      // });
    }
  }


  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
}
