import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap';
import { OrderapiService } from '../orderapi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // 接收父页面this对象
  parentthis;
  order: any = {};
  start: Date = new Date(); // 加工交期最小日期
  packtypes = [{ value: '裸包装', label: '裸包装' }, { value: '油纸包装', label: '油纸包装' }, { value: '简包装', label: '简包装' },
   { value: '精包装', label: '精包装' }];
  neijings = [{ value: '508', label: '508' }, { value: '610', label: '610' }];
  xiubians = [{ value: true, label: '是' }, { value: false, label: '否' }];
  jiaoqidate = null; // 加工交期
  constructor(
    private toast: ToasterService,
    public bsModalRef: BsModalRef,
    private orderApi: OrderapiService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.order = JSON.parse(JSON.stringify(this.parentthis.order));
      if (this.order['jiaoqidate']) {
        this.jiaoqidate = new Date(this.order['jiaoqidate']);
      }
      // 没值的时候默认508
      if (!this.order['neijing']) {
        this.order['neijing'] = '508';
      }
    }, 0);
  }
  edit() {
    if (this.jiaoqidate) {
      this.order['jiaoqidate'] = this.datepipe.transform(this.jiaoqidate, 'y-MM-dd');
    }
    if (!this.order['packtype']) { this.toast.pop('warning', '请选择包装方式！'); return; }
    if (!this.order['neijing']) { this.toast.pop('warning', '请选择卷内径！'); return; }
    if (!this.jiaoqidate) { this.toast.pop('warning', '请选择加工交期！'); return; }
    if (this.order['gnid'] === 3 && (this.order['isxiubian'] === null || this.order['isxiubian'] === undefined)) {
      this.toast.pop('warning', '请选择是否修边！'); return;
    }
    this.orderApi.savebeizhu(this.order).then(() => {
      this.parentthis.closejiagong();
      this.toast.pop('success', '保存成功');
    });
  }
  closeq() {
    this.parentthis.closejiagong();
  }
}
