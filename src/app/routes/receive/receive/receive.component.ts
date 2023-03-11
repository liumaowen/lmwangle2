import { Router } from '@angular/router';
import { element } from 'protractor';
import { ToasterService } from 'angular2-toaster';
import { CustomerapiService } from './../../customer/customerapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ReceiveapiService } from './../receiveapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {

  // 总条目
  totalItems: any;

  // 表格数据
  singleData;

  querys = { pagenum: 1, pagesize: 10, status: '' };

  endmax = new Date();
  kuaijikemus = [{ value: '', label: '全部' }, { value: 1, label: '营业外收入' },
  { value: 3, label: '银行存款' },
  { value: 4, label: '应收票据' }, { value: 5, label: '预收账款' },
  { value: 6, label: '库存现金' }];
  params: any = {};
  public currentPage: number = 1;

  constructor(private receiveApi: ReceiveapiService, private orgApi: OrgApiService,
    private datepipe: DatePipe, private customerApi: CustomerapiService,
    private toast: ToasterService, private router: Router) {
    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.receiveApi.query(this.querys).then(data => {
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

  status;

  isonlinelist;

  companyflag = {};
  model = {};

  // 启动查询对话框
  queryDialog() {
    this.companyflag = { type: '' };
    this.status = [{ value: '', label: '全部' }, { value: 0, label: '制单中' }, { value: 1, label: '待审核' }, { value: 2, label: '已核收' }];

    this.isonlinelist = [{ value: '', label: '全部' }, { value: true, label: '线上' }, { value: false, label: '线下' }];
    this.querys = { pagenum: 1, pagesize: 10, status: '' };
    this.selectNull();
    // 查询机构
    // this.orgApi.listAll(0).then((data) => {
    //   this.depts = data;
    // });
    this.showqueryModal();
    // ngDialog.open({
    //   template: 'views/receive/receive_query_condition.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-600',
    //   closeByDocument: true,
    //   closeByEscape: true,
    //   showClose: true
    // });
  };

  // 重置条件
  companyOfName;

  vuser;

  cuser;

  saleman;

  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10, status: '' };
    this.companyOfName = undefined;
    this.model = {};
    this.vuser = undefined;
    this.cuser = undefined;
    this.saleman = undefined;
  };

  // 查询收款信息
  query() {
    if (typeof (this.companyOfName) === 'object') {
      this.querys['paycustomerid'] = this.companyOfName['code'];
    } else {
      this.querys['paycustomerid'] = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.querys['vuserid'] = this.vuser['code'];
    } else {
      this.querys['vuserid'] = '';
    }
    if (typeof (this.cuser) === 'object') {
      this.querys['cuserid'] = this.cuser['code'];
    } else {
      this.querys['cuserid'] = '';
    }
    if (typeof (this.saleman) === 'object') {
      this.querys['salemanid'] = this.saleman['code'];
    } else {
      this.querys['salemanid'] = '';
    }
    // 转换时间格式，否则，传到服务器端乱，而且重选打开对话框是格式也乱
    this.querys['start'] = this.querys['start'] ? this.datepipe.transform(this.querys['start'], 'y-MM-dd') : '';
    this.querys['audit'] = this.querys['audit'] ? this.datepipe.transform(this.querys['audit'], 'y-MM-dd') : '';
    if (!this.querys['audit']) {
      delete this.querys['audit'];
    }
    if (!this.querys['start']) {
      delete this.querys['start'];
    }
    if (!this.querys['deptid']) {
      delete this.querys['deptid'];
    }
    this.listDetail();
    console.log(this.companyOfName);
    this.hidequeryModal();
  };

  wiskind = new Array();

  // 启动添加对话框
  createDialog() {
    this.companyflag = { type: 'false' };
    // 得到公司所有的收款银行和账号防止输入有误
    this.companyOfName = {};
    this.customerApi.findwiskind().then((data) => {
      const lslists = [{ label: '请选择收款公司', value: '' }];
      data.forEach(element => {
        lslists.push({
          label: element.name,
          value: element.id
        });
      });
      this.wiskind = lslists;
    });
    this.showcreateModal();
  };

  // 判断所选择的公司是不是和当前用户匹配
  checkcompany() {
    // console.log(this.companyOfName);
    // if (!this.companyOfName || typeof (this.companyOfName) === 'string') {
    //   return;
    // }
    // if (this.companyOfName['name'].indexOf('公用') >= 0) {
    //   return;
    // }
    // this.customerApi.checkCompany({ customerid: this.companyOfName['code'] }).then((response) => {
    //   console.log(response);
    //   if (!response['flag']) {
    //     this.toast.pop('warning', response['msg']);
    //     this.hidecreateModal();
    //   }
    // });
  }

  bankaccounts;
  getbank(receivecustomerid) {
    this.receiveApi.findbycustomerid(receivecustomerid).then((data) => {
      let lslists = [{ label: '请选择收款银行', value: '' }];
      data.forEach(element => {
        lslists.push({
          label: element.bank,
          value: element.id
        })
      });
      this.bankaccounts = lslists;
    });
  }

  // 收款银行都有了银行卡号也要有啊!出来吧银行卡号！！！
  getcardno(bankcardid) {
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      this.model['shoukuanaccount'] = data['fukuanaccount'];
    });
  }

  isonlinecompany = 'false';

  // 当变换线上线下公司的时候清空需方公司
  setcompanyNull() {
    this.companyOfName = undefined;
    if (this.companyflag['type'] === 'true') {
      this.isonlinecompany = 'true';
    } else if (this.companyflag['type'] === 'false') {
      this.isonlinecompany = 'false';
    }
  }

  // 创建收款单登记表
  addReceive() {
    console.log(this.companyOfName);
    if (typeof (this.companyOfName) !== 'object') {
      this.toast.pop('请选择公司');
      return '';
    }
    if (this.companyflag['type'] !== this.companyOfName['isonline'] + '') {
      this.toast.pop('warning', '所选公司类型和所选公司的公司类型不一致！');
      // Notify.alert("所选公司类型和所选公司的公司类型不一致！", { status: 'warning' });
      return '';
    }
    if (this.model['jine']) {
      let jine = this.model['jine'];
      // ^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$
      const str = jine.match(/^-?\d+(\.\d{1,2})?$/);
      if (str) {
        if (confirm('确定创建吗？')) {
          this.model['paycustomerid'] = this.companyOfName.code;
          // ngDialog.close();
          this.hidecreateModal();
          this.receiveApi.create(this.model).then(model => {
            // this.router.navigate(['receive', model['id']], { queryParams: { customerid: model['paycustomerid'] } })
            this.router.navigate(['receive', model['id']]);
            // $state.go('app.receive-view', { id: model.id, params: { customerid: model.paycustomerid } });
          });
        }
      } else {
        this.toast.pop('warning', '金额只允许保留两位小数！！！');
      }
    }
  }

  // 通过审核
  auditThrough(item) {
    if (!item['kuaijikemu']) {
      this.toast.pop('warning', '请添加会计科目！');
      return;
    }
    if (confirm('确定该登记单通过审核吗？')) {
      this.receiveApi.audit(item['id'], item['kuaijikemu']).then((model) => {
        this.toast.pop('success', '审核成功');
        this.listDetail();
      });
    }
  };
  // 删除付款单
  del(id) {
    if (confirm('确定删除该登记单吗？')) {
      this.receiveApi.del(id).then((model) => {
        this.toast.pop('success', '删除成功');
        this.listDetail();
      });
    }
  }
  /**添加会计科目 */
  addkuaijikemu(item) {
    this.params = JSON.parse(JSON.stringify(item));
    this.showkuaijikemuModal();
  }
  /**保存会计科目 */
  saveKuaijikemu() {
    if (confirm('确定要保存？')) {
      this.receiveApi.update(this.params['id'], this.params).then((model) => {
        this.toast.pop('success', '保存成功');
        this.hidekuaijikemuModal();
        this.params = {};
        this.listDetail();
      });
    }
  }

  // 关账功能弹出选择时间的对话框
  closeaccount = {};

  placeholder = {}
  closeaccountDialog() {
    this.placeholder = { msg: null };
    this.receiveApi.getCloseaccountTime().then((response) => {
      console.log(response);
      this.closeaccount['time'] = response['time'];
      this.closeaccount['times'] = new Date(response['time']);
    });

    this.showaccountModal();
  }

  closeAccount() {
    if (!this.closeaccount['times']) {
      this.toast.pop('warning', '请填写关账时间');
      return;
    }
    if (this.closeaccount['time'] === this.datepipe.transform(this.closeaccount['times'], 'y-MM-dd')) {
      this.toast.pop('warning', '请选择日期！');
      return;
    }

    this.receiveApi.closeaccount({ time: this.datepipe.transform(this.closeaccount['times'], 'y-MM-dd') }).then(() => {
      // Notify.alert("关账时间设置成功", { status: 'success' });
      // ngDialog.close();
      this.toast.pop('success', '关账时间设置成功');
      this.hideaccountModal();
    });
  }

  // 开账
  openaccount() {
    this.receiveApi.openaccount().then(() => {
      // Notify.alert("开账成功", { status: 'success' });
      this.toast.pop('success', '开账成功');
      this.hideaccountModal();
      // ngDialog.close();
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

  @ViewChild('accountModal') private accountModal: ModalDirective;

  showaccountModal() {
    this.accountModal.show();
  }

  hideaccountModal() {
    this.accountModal.hide();
  }
  /**会计科目弹窗 */
  @ViewChild('kuaijikemuModal') private kuaijikemuModal: ModalDirective;

  showkuaijikemuModal() {
    this.kuaijikemuModal.show();
  }

  hidekuaijikemuModal() {
    this.kuaijikemuModal.hide();
  }

}
