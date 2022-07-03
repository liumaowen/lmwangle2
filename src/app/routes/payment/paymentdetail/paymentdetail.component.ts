import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../../dnn/service/storage.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentapiService } from './../paymentapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-paymentdetail',
  templateUrl: './paymentdetail.component.html',
  styleUrls: ['./paymentdetail.component.scss']
})
export class PaymentdetailComponent implements OnInit {

  current = this.storage.get('cuser');

  flag = { verify: false };

  // 获取付款款登记单
  model = {};

  constructor(private numberpipe: DecimalPipe,private storage: StorageService, private route: ActivatedRoute, private paymentApi: PaymentapiService,
    private toast: ToasterService) {
    this.model = { receivecustomer: {}, cuser: {} };

    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.paymentApi.get(this.route.params['value']['id']).then(data => {
      this.model = data['model'];
      this.model['bigjine'] = data['bigjine'];
      this.model['jine'] = this.numberpipe.transform(this.model['jine'], '1.2-2');
      if (!this.model['isv']) {
        this.flag['verify'] = true;
      }
    });
  }

  // 付款审核
  verify() {
    if (this.model['isv']) {
      this.toast.pop('warning', '单据已经审核');
      return;
    }
    if (confirm('你已经完成付款，确定要审核吗？')) {
      this.paymentApi.audit(this.model['id']).then((response) => {
        this.toast.pop('success', '审核成功');
      });
    }
  }

  // 生成PDF
  fukuanlode() {
    this.paymentApi.fukuanlode(this.model['id']).then((model) => {
      console.log(model);
      this.toast.pop('warning', model['msg']);
    });
  }

  // 打印预览
  print() {
    this.paymentApi.print(this.model['id']).then((model) => {
      console.log(model);
      if (!model['flag']) {
        this.toast.pop('warning', model['msg']);
      } else {
        window.open(model['msg']);
      }
    });
  }

}
