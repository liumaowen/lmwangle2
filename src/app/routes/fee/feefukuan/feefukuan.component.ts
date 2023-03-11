import { ReceiveapiService } from './../../receive/receiveapi.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { element } from 'protractor';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeefukuanapiService } from './../feefukuanapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feefukuan',
  templateUrl: './feefukuan.component.html',
  styleUrls: ['./feefukuan.component.scss']
})
export class FeefukuanComponent implements OnInit {
  start;
  end;
  endmax = new Date();
  querys = { pagenum: 1, pagesize: 10, paycustomerid: '', feecustomerid: '', orgid: '', cuserid: '', vuserid: '', fapiaohao: '' };
  singleData: any;
  totalItems: any;
  public currentPage: number = 1;
  constructor(private feefukuanApi: FeefukuanapiService, private toast: ToasterService,
    private customerApi: CustomerapiService, private orgApi: OrgApiService,
    private datepipe: DatePipe, private router: Router, private receiveApi: ReceiveapiService) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.feefukuanApi.query(this.querys).then(data => {
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
  };

  del(id) {
    if (confirm('你确定删除吗？')) {
      this.feefukuanApi.removeFeefukuan(id).then(() => {
        this.toast.pop('success', '删除执行成功');
        this.listDetail();
      });
    }
  }
  orgs = [];
  paycustomer = [];
  // 查询
  queryDialog() {
    this.selectNull();
    // 付款机构
    this.orgApi.listAll(0).then((response) => {
      let orglists = [{ label: '全部', value: '' }];
      response.forEach(element => {
        orglists.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglists;
    });
    // 付款单位
    this.customerApi.findwiskind().then((response) => {
      let paycustomerlists = [{ label: '全部', value: '' }];
      response.forEach(element => {
        paycustomerlists.push({
          label: element.name,
          value: element.id
        });
      });
      this.paycustomer = paycustomerlists;
    });
    this.showqueryModal();
  }

  feecustomer;

  cuser;

  vuser

  selectNull() {
    this.feecustomer = undefined;
    this.cuser = undefined;
    this.vuser = undefined;
    this.start = undefined;
    this.end = undefined;
    this.querys = { pagenum: 1, pagesize: 10, paycustomerid: '', feecustomerid: '', orgid: '', cuserid: '', vuserid: '', fapiaohao: '' };
  }

  // 开始条件查询
  query() {
    if (this.start) {
      this.querys['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.querys['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (typeof (this.cuser) === 'object') {
      this.querys.cuserid = this.cuser['code'];
    } else {
      this.querys.cuserid = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.querys.vuserid = this.vuser['code'];
    } else {
      this.querys.vuserid = '';
    }
    if (typeof (this.feecustomer) === 'object') {
      this.querys.feecustomerid = this.feecustomer['code'];
    } else {
      this.querys.feecustomerid = '';
    }
    this.listDetail();
    this.hidequeryModal();
  }

  // 弹出创建费用付款单的创建页面
  feefukuan = {fukuantype:false};
  createDialog() {
    this.findWiskind();
    this.showcreateModal();
  }

  companyOfFee;

  // 数据准备好了开始创建吧
  createfeefukuan() {
    if (typeof (this.companyOfFee) === 'object') {
      this.feefukuan['feecustomerid'] = this.companyOfFee['code'];
    } else {
      this.feefukuan['feecustomerid'] = '';
    }
    if (!this.feefukuan['feecustomerid']) {
      // Notify.alert('请选择费用单位！', { status: 'warning' });
      this.toast.pop('warning', '请选择费用单位！');
      return;
    }
    if (!this.feefukuan['feebankid']) {
      this.toast.pop('warning', '请选择费用银行！');
      // Notify.alert('请选择费用银行！', { status: 'warning' });
      return;
    }
    // if (!this.feefukuan['feeorgid']) {
    //   this.toast.pop('warning', '请选择费用承担机构！');
    //   // Notify.alert('请选择费用承担机构！', { status: 'warning' });
    //   return '';
    // }
    // if (!this.feefukuan['paycustomerid']) {
    //   this.toast.pop('warning', '请选择付款公司');
    //   return;
    // }
    this.feefukuanApi.create(this.feefukuan).then((response) => {
      this.hidecreateModal();
      this.router.navigate(['feefukuan', response['id']]);
    });
  }

  // 如果没有费用公司银行信息的时候可以自己主动添加
  addfeebank() {
    if (typeof (this.companyOfFee) !== 'object') {
      // Notify.alert('请选择费用公司！', { status: 'warning' });
      this.toast.pop('warning', '请选择费用公司！');
      return '';
    }
    this.hidecreateModal();
    this.router.navigate(['customer', this.companyOfFee['code']]);
    // ngDialog.close();
    // $state.go("app.customer-view.bankaccount", { id: $scope.companyOfFee.selected.id });
  }

  // 获取费用公司的银行账号信息
  feebanks = [];
  findBank() {
    if (typeof (this.companyOfFee) !== 'object') {
      return '';
    }
    this.feebanks = [];
    this.feefukuan['feebankid'] = undefined;
    this.feefukuan['feebankaccount'] = undefined;
    this.receiveApi.findbycustomerid(this.companyOfFee['code']).then((data) => {
      let feebanklists = [{ label: '请选择', value: '' }];
      data.forEach(element => {
        feebanklists.push({
          label: element.bank,
          value: element.id
        })
      })
      this.feebanks = feebanklists;
    });
  }

  // 收款银行都有了银行卡号也要有啊!出来吧银行卡号！！！
  getcardno(bankcardid) {
    if (!bankcardid) {
      this.feefukuan['feebankaccount'] = null;
      return '';
    }
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      this.feefukuan['feebankaccount'] = data['fukuanaccount'];
    });
  }

  clear() {
    this.feefukuan = {fukuantype:false};
    this.companyOfFee = undefined;
  }

  findorg() {
    this.orgApi.listAll(0).then((response) => {
      let orglists = [{ label: '请选择', value: '' }];
      response.forEach(element => {
        orglists.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglists;
    });
  }

  companyIsWiskind = [];
  findWiskind() {
    this.customerApi.findwiskind().then((response) => {
      let paycustomerlists = [{ label: '请选择', value: '' }];
      for (let i = 1; i < response.length; i++) {
        if (response[i].id === 3453) {
          response.splice(i, 1);
        }
      }
      console.log('response', response);
      response.forEach(element => {
        paycustomerlists.push({
          label: element.name,
          value: element.id
        });
      });
      this.companyIsWiskind = paycustomerlists;
    });
  }

  @ViewChild('queryModal') private queryModal: ModalDirective;

  showqueryModal() {
    this.queryModal.show();
  }

  hidequeryModal() {
    this.queryModal.hide();
  }

  @ViewChild('createModal') private createModal: ModalDirective;

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }
  testnc() {
    this.feefukuanApi.testNC().then(data => {

    })
  }
}
