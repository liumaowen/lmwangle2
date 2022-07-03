import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap';
import { OrderapiService } from '../orderapi.service';

@Component({
  selector: 'app-jiagongmsg',
  templateUrl: './jiagongmsg.component.html',
  styleUrls: ['./jiagongmsg.component.scss']
})
export class JiagongmsgComponent implements OnInit {
  // 接收父页面this对象
  parentthis;
  taskjson = {};
  iszong = true;
  slitlist = [];
  slitjson = {};
  types = [{ id: '1', text: '纵剪' }, { id: '2', text: '横切' }, { id: '3', text: '纵剪+横切' }];
  constructor(
    private toast: ToasterService,
    public bsModalRef: BsModalRef,
    private orderApi: OrderapiService
    ) { }

  ngOnInit() {
  }
  selectetype(e) {
    this.taskjson['type'] = e.id;
    if (e.id === '1') {
      this.iszong = true;
    } else {
      this.iszong = false;
      this.slitlist = [];
    }
  }
  importBm() {
    console.log(this.taskjson);
    if (!this.taskjson['type']) {
      this.toast.pop('warning', '请选择加工类型！');
      return;
    }
    if (!this.taskjson['singleweight'] || this.taskjson['singleweight'] === '') {
      this.toast.pop('warning', '请填写单包重量！');
      return;
    }
    if (this.taskjson['type'] === '1') {
      if (this.slitlist.length === 0) {
        this.toast.pop('warning', '请填写纵剪明细！');
        return;
      }
    } else {
      if (!this.taskjson['hqguige']) {
        this.toast.pop('warning', '请填写横切要求！');
        return;
      }
    }
    this.taskjson['orderid'] = this.parentthis.jiagongyaoqiu['orderid'];
    this.taskjson['orderdetids'] = this.parentthis.jiagongyaoqiu['orderdetids'];
    this.taskjson['slitjson'] = this.slitlist;
    console.log(this.taskjson);
    this.orderApi.addDetProduceClaim(this.taskjson).then(data => {
      this.parentthis.closejiagong();
    });
  }
  addslit() {
    if (!this.slitjson['slittingguige']) {
      this.toast.pop('warning', '请填写规格再添加！');
      return '';
    }
    if (!this.slitjson['slittingcount']) {
      this.toast.pop('warning', '请填写纵剪数量再添加！');
      return '';
    }
    if (this.slitjson['slittingcount'] <= 0 || this.slitjson['slittingguige'] <= 0) {
      this.toast.pop('warning', '纵剪规格、数量不能为零或负数！');
      return;
    }
    this.slitlist.push({ slittingguige: this.slitjson['slittingguige'], slittingcount: this.slitjson['slittingcount'] });
    this.slitjson = {};
  }
  delitem(index) {
    console.log('del', index);
    this.slitlist.splice(index, 1);
  }
  closeq() {
    this.parentthis.closejiagong();
  }
}
