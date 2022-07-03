import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessorderapiService } from './../businessorderapi.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-overdraftdetail',
  templateUrl: './overdraftdetail.component.html',
  styleUrls: ['./overdraftdetail.component.scss']
})
export class OverdraftdetailComponent implements OnInit {
  @ViewChild('huankuanModal') private huankuanModal: ModalDirective;
  @ViewChild('modifyModal') private modifyModal: ModalDirective;
  overdraft = { cuser: {} };
  list = [];
  search = {};
  modify = {};
  gntype = '';
  isfinance = false;
  ishandtext = '';
  constructor(private businessorderApi: BusinessorderapiService, private route: ActivatedRoute, private toast: ToasterService) {
    this.get();
  }

  ngOnInit() {
  }
  get() {
    this.businessorderApi.getoverdraftdetail(this.route.params['value']['id']).then(data => {
      let myrole = JSON.parse(localStorage.getItem('myrole'));
      for (let i = 0; i < myrole.length; i++) {
        // 业务员不可跳转入库单
        if (myrole[i] === 5) {
          this.isfinance = true;
        }
      }
      this.overdraft = data['overdraft'];
      if(this.overdraft['ishandrepay']){
        this.ishandtext = '自动还款';
      }else{
        this.ishandtext = '手动还款';
      }
      if(this.overdraft['gntype'] === 1){
        this.gntype = '鼓励类';
      }else if(this.overdraft['gntype'] === 2){
        this.gntype = '创新类';
      }else if(this.overdraft['gntype'] === 3){
        this.gntype = '普通类';
      }
      this.list = data['loglist'];
    });
  }
  huankuan() {
    if (this.overdraft['weijine'] === '0') {
      this.toast.pop('warning', '该欠款单已完成还款，无需再进行还款！');
      return;
    }
    this.huankuanModal.show();
  }
  verifyhuankuan() {
    if (this.overdraft['hjine'] === '0') {
      this.toast.pop('warning', '该欠款单暂无还款，无需审核！');
      return;
    }
    if (confirm('你确定审核还款' + this.overdraft['hjine'] + '元吗？')) {
      this.businessorderApi.verifyhuankuan(this.route.params['value']['id']).then(data => {
        this.get();
      });
    }
  }
  modifyishand(){
    this.businessorderApi.modifyishand(this.route.params['value']['id']).then(data => {
      this.get();
    });
  }

  hideModal() {
    this.huankuanModal.hide();
  }
  confirm() {
    if (!this.search['hjine']) {
      this.toast.pop('warning', '请填写还款金额！');
      return;
    }
    if (this.search['hjine'] === 0) {
      this.toast.pop('warning', '还款金额不能为零！');
      return;
    }
    this.search['id'] = this.route.params['value']['id'];
    console.log(this.search);
    this.businessorderApi.huankuan(this.search).then(data => {
      this.get();
      this.hideModal();
    });
  }
  modifyhuankuan() {
    this.modify = {};
    this.modifyModal.show();
  }
  hidemodifyModal() {
    this.modifyModal.hide();
  }
  confirmmodify() {
    if (!this.modify['hjine']) {
      this.toast.pop('warning', '请填写还款金额！');
      return;
    }
    if (!this.modify['yhjine']) {
      this.toast.pop('warning', '请填写原来的还款金额！');
      return;
    }
    if (this.modify['hjine'] === 0) {
      this.toast.pop('warning', '还款金额不能为零！');
      return;
    }
    if (this.modify['yhjine'] === 0) {
      this.toast.pop('warning', '原来的还款金额不能为零！');
      return;
    }
    this.modify['id'] = this.route.params['value']['id'];
    this.businessorderApi.modifyhuankuan(this.modify).then(data => {
      this.get();
      this.hidemodifyModal();
    });
  }
}
