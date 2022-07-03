import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../../dnn/service/storage.service';
import { BpricelogapiService } from './../bpricelogapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-bpricelog',
  templateUrl: './bpricelog.component.html',
  styleUrls: ['./bpricelog.component.scss']
})
export class BpricelogComponent implements OnInit {

  querys = { pagenum: 1, pagesize: 10 };

  singleData: any;

  totalItems: any;

  public currentPage = 1;

  cuser;

  vuser;

  constructor(private bpricelogApi: BpricelogapiService,
    private storage: StorageService,
    private router: Router,
    private toast: ToasterService) {

    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.bpricelogApi.pageList(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    });
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.listDetail();
  }

  // 启动查询对话框
  openQueryDialog() {
    this.selectNull();
    this.showqueryModal();
  }

  // 查询入库单
  query() {
    if (typeof (this.cuser) === 'object') {
      this.querys['cuserid'] = this.cuser['code'];
    } else {
      this.querys['cuserid'] = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.querys['vuserid'] = this.vuser['code'];
    } else {
      this.querys['vuserid'] = '';
    }
    this.hidequeryModal();
  };

  // 重置条件
  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10 };
    this.cuser = undefined;
    this.vuser = undefined;
  }

  // 删除没有审核的记录
  removeLod(bpricelogid) {
    if (confirm('你确定删除吗？')) {
      this.bpricelogApi.remove(bpricelogid).then(data => {
        this.toast.pop('success', '删除成功');
      });
    }
  }

  // 重新定价
  reBpirce(bpricelogid) {
    if (confirm('你确定重新定价吗？')) {
      const templog = {};
      templog['isdel'] = true;
      templog['bpricelogid'] = 0;
      templog['isv'] = true;

      // 待测试
      this.router.navigate(['bpricelogdet', bpricelogid], { queryParams: { params: JSON.stringify(templog) } });
      // $state.go('app.bpricelogdet', {
      //   bpricelogid: bpricelogid,
      //   params: templog
      // });
    }
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('queryModal') private queryModal: ModalDirective;

  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }

}
