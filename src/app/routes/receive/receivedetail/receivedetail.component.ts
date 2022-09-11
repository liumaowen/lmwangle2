import { UserapiService } from 'app/dnn/service/userapi.service';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ReceiveapiService } from './../receiveapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-receivedetail',
  templateUrl: './receivedetail.component.html',
  styleUrls: ['./receivedetail.component.scss']
})
export class ReceivedetailComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('userModal') private userModal: ModalDirective;
  @ViewChild('zhuanzhang') private zhuanzhang: ModalDirective;
  @ViewChild('zhiyajindialog') private zhiyajindialog: ModalDirective;
  @ViewChild('hetongdialog') private hetongdialog: ModalDirective;
  // s生成质押金
  companys: any;
  zhiyajin: any = { zhiyadaoqiri: null, actualcustomerid: null, shoukuanid: null, beizhu: null };
  // 合同上传信息及格式
  uploadParam: any = { module: 'qihuo', count: 1, sizemax: 5, extensions: ['doc', 'pdf', 'png', 'jpg'] };
  // 设置上传的格式
  accept = null; // ".xls, application/xls";
  model: any = { paycustomer: {}, org: {}, kuaijikemu: null };

  ngflag = { text: true, select: false };
  buyer: any; // 买方
  id = { id: this.route.params['value']['id'] }; // 得到收款信息的id
  wiskind = [];
  bankaccounts;
  flag = { audit: false };
  bank = {};
  gpsalemanname = '';
  gporgname = '';
  iscaiwubu = true;//是否是财务人员
  shoukuantypes = [{ value: '', label: '全部' },
  { value: 1, label: '电汇' },
  { value: 2, label: '银行承兑汇票' },
  { value: 3, label: '商业承兑汇票' },
  { value: 4, label: '往来余额处理' },
  { value: 5, label: '转账' },
  { value: 6, label: '现金' }];
  kuaijikemus = [{ value: '', label: '全部' }, { value: 1, label: '营业外收入' },
  { value: 3, label: '银行存款' },
  { value: 4, label: '应收票据' }, { value: 5, label: '预收账款' },
  { value: 6, label: '库存现金' }];
  oldkuaijikemu: any; // 接口中的会计科目
  suser;
  saleman;
  endmax = new Date();
  actualdatetime;
  receivebanks = [];
  isverify = false; // 审核
  iswuliubu: boolean;
  constructor(private numberpipe: DecimalPipe,private route: ActivatedRoute, private receiveApi: ReceiveapiService, private customerApi: CustomerapiService,
    private toast: ToasterService, private datepipe: DatePipe, private router: Router, private userApi: UserapiService) {
    this.get();
  }

  ngOnInit() {
  }

  // 获取收款登记单
  get() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 5 || item === 38 || item === 49)) { // 财务人员和往来管理和测试人员人员
      this.iscaiwubu = true;
    }else{
      this.iscaiwubu = false;
    }
    this.receiveApi.get(this.route.params['value']['id']).then((data) => {
      this.model = data;
      this.model['jine'] = this.numberpipe.transform(this.model['jine'], '1.2-2');
      // 如果金额为负数且收款类型不为往来余额处理，则是退余款
      if (this.model.status === 1) {
        this.isverify = true;
      } else {
        this.isverify = false;
      }
      console.log(this.model['status'] === 1 && this.model['isrefund'] && !this.model['paycustomer']['isonline'] && !this.model['orgisv']);
      this.gpsalemanname = this.model['gpsaleman']['realname'];
      this.gporgname = this.model['gpsaleman']['org']['name'];
      if (this.model['status'] === 1) {
        this.flag['audit'] = true;
      }
      if (this.model['actualdate']) {
        this.actualdatetime = new Date(this.model['actualdate']);
      }
      this.oldkuaijikemu = this.model.kuaijikemu;
      this.wiskind = [];
      this.customerApi.findwiskind().then((resp) => {
        const lists = [{ label: '请选择收款公司', value: '' }];
        resp.forEach(element => {
          lists.push({
            label: element.name,
            value: element.id
          });
        });
        this.wiskind = lists;
      });
      // 获取用户的银行账号并以下拉框的形式显示
      this.receiveApi.findbycustomerid(this.model['paycustomerid']).then((res) => {
        this.bankaccounts = res;
      });
    });
  }

  // 收款公司变了就要改变收款银行账号
  getreceivebank(receivecustomerid) {
    this.model['shoukuanbankid'] = null;
    this.model['shoukuanaccount'] = null;
    this.model['receivecustomer'] = null;
    this.model['shoukuanbank'] = null;
    this.ngflag = { text: false, select: true };
    this.receiveApi.findbycustomerid(receivecustomerid).then((data) => {
      const lists = [{ label: '请选择收款公司', value: '' }];
      data.forEach(element => {
        lists.push({
          label: element.bank,
          value: element.id
        });
      });
      this.receivebanks = lists;
    });
  }

  // 收款银行都有了银行卡号也要有啊!出来吧银行卡号！！！
  getcardno(bankcardid) {
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      this.model['fukuanaccount'] = data['fukuanaccount'];
      this.model['branch'] = data['branch'];
    });
  }

  getcardno1(bankcardid) {
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      this.model['shoukuanaccount'] = data['fukuanaccount'];
    });
  }

  // 弹出创建银行信息的对话框
  createbankaccount() {
    this.showcreateModal();
  }
  // 创建付款银行信息
  addbankaccount() {
    this.bank['customerid'] = this.route.params['value']['customerid'];
    this.receiveApi.createbankaccount(this.bank).then(() => {
      this.hidecreateModal();
      this.toast.pop('success', '付款账户创建成功');
      // 执行刷新
      this.receiveApi.findbycustomerid(this.route.params['value']['customerid']).then((data) => {
        this.bankaccounts = data;
      });
    });
  }

  // 更新收款登记单信息
  modifyModel() {
    if (!this.actualdatetime) {
      this.toast.pop('warning', '请选择收款时间！');
      return;
    }
    if (!this.model['shoukuantype']) {
      this.toast.pop('warning', '请选择收款类型！');
      return;
    }
    if (!this.model['shoukuanbankname']) {
      if (!this.model['shoukuanbankid']) {
        this.toast.pop('warning', '收款银行不能为空！');
        return;
      }
    }
    if (!this.model['shoukuanaccount']) {
      this.toast.pop('warning', '收款账户不能为空！');
      return;
    }
    if (!this.model['jine']) {
      this.toast.pop('warning', '收款金额不能为空！');
      return;
    }
    if (this.model['isv']) {
      this.toast.pop('warning', '收款登记单已经审核不允许修改');
      return;
    }
    this.model['actualdate'] = this.datepipe.transform(this.actualdatetime, 'yyyy-MM-dd');
    console.log(this.model);
    if (confirm('确定要保存？')) {
      this.receiveApi.update(this.model['id'], this.model).then((model) => {
        this.toast.pop('success', '保存成功');
        this.get();
      });
    }
  }
  hidezhuanzhang() {
    console.log(this.buyer);
    if (this.buyer) {
      this.model['zhuanzhangcustomerid'] = this.buyer['code'];
      this.model['zhuanzhangcustomer']['name'] = this.buyer['name'];
    }
    this.model['zhuanzhangjine'] = this.model['jine'] * -1;
    this.zhuanzhang.hide();
  }
  chosezhuanzhang() {
    console.log(this.model['shoukuantype']);
    if (this.model['shoukuantype'] === 5) {
      this.zhuanzhang.show();
    }
  }
  // 提交审核
  submitverify() {
    // if (this.model['shoukuantype'] === 5 && !this.model['zhuanzhangcustomerid']) {
    //   this.toast.pop('warning', '收款类型为转账的请填写转账银行！');
    //   return;
    // }
    if (this.actualdatetime) {
      this.model['actualdate'] = this.datepipe.transform(this.actualdatetime, 'yyyy-MM-dd');
    }
    if (!this.model['actualdate']) {
      this.toast.pop('warning', '请选择收款时间！');
      return;
    }
    if (!this.model['shoukuantype']) {
      this.toast.pop('warning', '请选择收款类型！');
      return;
    }
    if (this.model['isv']) {
      this.toast.pop('warning', '收款登记单已经审核不允许修改');
      return;
    }
    // this.model['actualdate'] = this.datepipe.transform(this.model['actualdate'], 'yyyy-MM-dd HH:mm:ss');
    if (confirm('确定要提交审核吗？')) {
      this.receiveApi.submitverify(this.model['id'], this.model).then((model) => {
        this.toast.pop('success', '提交成功');
        this.router.navigateByUrl('receive');
      });
    }
  }
  // 通过审核
  orgAuditThrough() {
    if (this.model['isv']) {
      this.toast.pop('warning', '收款登记单已经审核不允许修改');
      return;
    }
    if (confirm('确定该退款登记单通过审核吗？')) {
      this.receiveApi.orgaudit(this.model['id']).then((model) => {
        this.toast.pop('success', '审核成功');
        this.get();
      });
    }
  }

  // 通过审核
  auditThrough() {
    if (this.model['isv']) {
      this.toast.pop('warning', '收款登记单已经审核不允许修改');
      return;
    }
    if (!this.model['kuaijikemu']) {
      this.toast.pop('warning', '请先填写会计科目！');
      return;
    }
    if (confirm('确定该登记单通过审核吗？')) {
      this.receiveApi.audit(this.model['id'], this.model['kuaijikemu']).then((model) => {
        this.toast.pop('success', '审核成功');
        this.get();
      });
    }
  }
  // 拒审
  refuse() {
    if (this.model['isv']) {
      this.toast.pop('warning', '收款登记单已经审核不允许修改');
      return;
    }
    if (confirm('确定拒审该登记单？')) {
      this.receiveApi.refuse(this.model['id']).then((model) => {
        this.toast.pop('success', '拒审成功');
        this.router.navigateByUrl('receive');
      });
    }
  }

  // 生成PDF
  shoukuanlode() {
    this.receiveApi.shoukuanlode(this.model['id']).then((model) => {
      console.log(model);
      this.toast.pop('warning', model['msg']);
    });
  }

  // 打印预览
  print() {
    this.receiveApi.print(this.model['id']).then((model) => {
      console.log(model);
      if (!model['flag']) {
        this.toast.pop('warning', model['msg']);
      } else {
        window.open(model['msg']);
      }
    });
  }

  submitsaleman() {
    console.log(this.suser);
    if (typeof (this.suser) === 'object') {
      this.model['salemanid'] = this.suser['code'];
      this.model['saleman']['realname'] = this.suser['name'];
      this.userApi.get(this.model['salemanid']).then((data) => {
        this.model['deptid'] = data['orgid'];
        this.model['dept'] = data['org'];
      });
    }
    this.hideuserModal();
  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  showuserModal() {
    this.userModal.show();
  }

  hideuserModal() {
    this.userModal.hide();
  }
  savezhuanzhang() {
    if (this.buyer) {
      this.model['zhuanzhangcustomerid'] = this.buyer['code'];
      this.model['zhuanzhangcustomer']['name'] = this.buyer['name'];
    }
    this.model['zhuanzhangjine'] = this.model['jine'] * -1;
    this.zhuanzhang.hide();
  }

  closeThisDialog() {
    this.model['gpsalemanid'] = this.saleman['code'];
    this.gpsalemanname = this.saleman['name'];
    this.receiveApi.addgpsaleman(this.model).then((model) => {
      console.log(model);
      this.toast.pop('success', '添加成功');
      // 				$state.go('app.receive');
      this.get();
    });
    this.hideclassicModal();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }
  // 添加业务负责人
  addsalemanDialog() {
    this.showclassicModal();
  }
  showclassicModal() {
    this.classicModal.show();
  }
  // 质押金生成
  createzhiyajindialog() {
    this.zhiyajindialog.show();
  }
  closezhiyajindialog() {
    this.zhiyajindialog.hide();
  }
  commitzhiyajin() {
    if (this.companys) {
      this.zhiyajin['actualcustomerid'] = this.companys['code'];
    } else {
      this.toast.pop('warning', '请选择欠款客户名称。');
      return;
    }
    if (!this.zhiyajin['zhiyadaoqiri']) {
      this.toast.pop('warning', '请选择质押到期日。');
      return;
    }
    if (!this.model['isv']) {
      this.toast.pop('warning', '请联系财务审核收款单后再提交质押金审批！');
      return;
    }
    this.zhiyajin['zhiyadaoqiri'] = this.datepipe.transform(this.zhiyajin['zhiyadaoqiri'], 'yyyy-MM-dd');
    this.zhiyajin['shoukuanid'] = this.model['id'];
    if (confirm('你确定要提交质押金审批吗？')) {
      this.receiveApi.createzhiyajin(this.zhiyajin).then(data => {
        this.router.navigate(['zhiyajin', data['id']]);
      });
    }
  }
  selectNull() {
    this.companys = null;
    this.zhiyajin = { zhiyadaoqiri: null, actualcustomerid: null, shoukuanid: null, beizhu: null };
  }
  // 合同上传弹窗
  contractUploader() {
    this.hetongdialog.show();
  }
  // 上传成功执行的回调方法
  upcontract($event) {
    console.log($event);
    const model = { shoukuanid: this.model['id'], url: $event.url };
    if ($event.length !== 0) {
      this.receiveApi.uploadcontract(model).then(data => {
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideuploadDialog();
  }
  // 关闭上传弹窗
  hideuploadDialog() {
    this.hetongdialog.hide();
  }
  lookContract() {
    this.receiveApi.lookContract(this.model['id']).then(data => {
      console.log(data);
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    });
  }

}
