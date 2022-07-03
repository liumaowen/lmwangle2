import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessorderapiService } from './../businessorderapi.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-overdraft',
  templateUrl: './overdraft.component.html',
  styleUrls: ['./overdraft.component.scss']
})
export class OverdraftComponent implements OnInit {
  @ViewChild('queryModal') private queryModal: ModalDirective;
  search = { pagenum: 1, pagesize: 10 };
  singleData: any;
  totalItems: any;
  public currentPage = 1;
  saleman;
  companyOfName;
  constructor(private businessorderApi: BusinessorderapiService) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.businessorderApi.queryoverdraft(this.search).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
      this.singleData.forEach(element => {
        console.log(element);
        if (element.vdate) {
          element.status = '已审核';
        } else {
          element.status = '未审核';
        }
        if (element.vdate && element.weijine > 0) {
          element.status = '未还款';
        }
        if (element.vdate && new Date() > new Date(element.yedate)) {
          element.status = '逾期';
        }
        if (element.vdate && element.sedate && element.weijine === '0') {
          element.status = '已还款';
        }
      });
    });
  }
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.listDetail();
  }
  queryDialog() {
    this.showqueryModal();
  }

  // 重置条件
  selectNull() {
    this.search = { pagenum: 1, pagesize: 10 };
    this.saleman = undefined;
    this.companyOfName = undefined;
  }
  query() {
    if (typeof (this.saleman) === 'string' || !this.saleman) {
      delete (this.search['salemanid']);
    } else if (typeof (this.saleman) === 'object') {
      this.search['salemanid'] = this.saleman['code'];
    }
    if (typeof (this.companyOfName) === 'string' || !this.companyOfName) {
      delete (this.search['customerid']);
    } else if (typeof (this.companyOfName) === 'object') {
      this.search['customerid'] = this.companyOfName['code'];
    }
    console.log(this.search);
    this.listDetail();
    this.hidequeryModal();
  }
  // 查询弹窗
  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }
}
