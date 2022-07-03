import { PaymentapiService } from './../paymentapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  // 总条目
  totalItems: any;

  // 表格数据
  singleData;

  querys = { pagenum: 1, pagesize: 10 };

  // 客户单位
  companys;

  endmax = new Date();

  // 审核人
  suser;

  // 创建时间
  start;

  // 审核时间
  audit;

  public currentPage = 1;

  constructor(private paymentApi: PaymentapiService, private datepipe: DatePipe, private toast: ToasterService) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.paymentApi.query(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    })
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

  // 启动查询对话框

  queryDialog() {
    this.showqueryModal();
  }

  // 查询收款信息
  query() {
    if (typeof (this.suser) === 'object') {
      this.querys['vuserid'] = this.suser['code'];
    } else {
      this.querys['vuserid'] = '';
    }
    if (typeof (this.companys) === 'object') {
      this.querys['receivecustomerid'] = this.companys['code'];
    } else {
      this.querys['receivecustomerid'] = '';
    }
    if (this.audit) {
      this.querys['audit'] = this.datepipe.transform(this.audit, 'y-MM-dd');
    } else {
      this.querys['audit'] = '';
    }
    if (this.start) {
      this.querys['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    } else {
      this.querys['start'] = '';
    }
    this.listDetail();
    this.hidequeryModal();
  }

  // 重置条件
  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10 };
    this.companys = undefined;
    this.suser = undefined;
    this.start = undefined;
    this.audit = undefined;
  };

  // 通过审核
  auditThrough(id) {
    if (confirm('确定该登记单通过审核吗？')) {
      this.paymentApi.audit(id).then((model) => {
        if (model.json()) {
          console.log(model['id']);
          this.toast.pop('success', '审核成功');
          this.listDetail();
        }
      });
    }
  }

  @ViewChild('queryModal') private queryModal: ModalDirective;

  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }
  del(id) {
    if (confirm('确定该登记单要删除吗？')) {
      this.paymentApi.del(id).then((model) => {
        this.toast.pop('success', '删除成功');
          this.listDetail();
      });
    }
  }
}
