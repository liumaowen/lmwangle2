import { XiaoshouapiService } from './../xiaoshouapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-xstuihuo',
  templateUrl: './xstuihuo.component.html',
  styleUrls: ['./xstuihuo.component.scss']
})
export class XstuihuoComponent implements OnInit {

  singleData;

  querys = { pagenum: 1, pagesize: 10 };

  suser;

  buyer;
  current = this.storage.getObject('cuser');

  status = [{ label: '全部', value: '' }, { label: '待审核', value: 1 }, { label: '已审核', value: 2 }];

  constructor(private tihuoApi: XiaoshouapiService,private storage: StorageService) {
    this.querydata();
  }

  ngOnInit() {
  }


  //分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querys['orgid'] = this.current.orgid;
    this.querydata();
  };

  totalItems;

  public currentPage: number = 1;
  querydata() {
    this.tihuoApi.queryxstuihuo(this.querys).then((data) => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  openDialog() {
    this.classicModal.show();
  }

  closeDialog() {
    this.classicModal.hide();
  }

  // 查询
  select() {
    if (this.suser) {
      this.querys['cuserid'] = '';
      this.querys['cuserid'] = this.suser['code'];
    }
    if (this.buyer) {
      this.querys['buyerid'] = '';
      this.querys['buyerid'] = this.buyer['code'];
    }
    this.querys['pagenum'] = 1;
    this.querys['pagesize'] = 10;
    this.currentPage = 1;
    console.log(this.querys);
    this.querydata();
    this.closeDialog();
  }

  // 重选
  selectNull() {
    this.buyer = null;
    this.suser = null;
    this.querys = { pagenum: 1, pagesize: 10 };
  }

}
