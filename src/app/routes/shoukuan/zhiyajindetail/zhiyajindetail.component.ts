import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ShoukuanService } from '../shoukuan.service';

@Component({
  selector: 'app-zhiyajindetail',
  templateUrl: './zhiyajindetail.component.html',
  styleUrls: ['./zhiyajindetail.component.scss']
})
export class ZhiyajindetailComponent implements OnInit {
  @ViewChild('createModal') private createModal: ModalDirective;
  model = { paycustomer: {}, org: {}, kuaijikemu: null, actualcustomer: {}, status: null, vuser: {} };

  ngflag = { text: true, select: false };
  buyer: any; // 买方
  id = { id: this.route.params['value']['id'] }; // 得到收款信息的id
  wiskind = [];
  bankaccounts;
  flag = { audit: false };
  bank = {};
  gpsalemanname = '';
  gporgname = '';
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
  shoukuan = { paycustomer: { name: null } };
  constructor(private numberpipe: DecimalPipe,private route: ActivatedRoute, private zhiyajinApi: ShoukuanService,
    private customerApi: CustomerapiService, private receiveapi: ReceiveapiService,
    private toast: ToasterService, private datepipe: DatePipe, private router: Router,
    private userApi: UserapiService) {
    this.get();
  }

  ngOnInit() {
  }

  // 获取收款登记单
  get() {
    this.zhiyajinApi.getzhiyajin(this.route.params['value']['id']).then((data) => {
      this.model = data;
      this.shoukuan = data.shoukuan;
      this.model['jine'] = this.numberpipe.transform(this.model['jine'], '1.2-2');
      // 如果金额为负数且收款类型不为往来余额处理，则是退余款
      if (this.model.status === 1) {
        this.isverify = true;
      } else {
        this.isverify = false;
      }
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
      this.receiveapi.findbycustomerid(this.model['shoukuan']['paycustomerid']).then((data1) => {
        this.bankaccounts = data1;
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
    this.receiveapi.findbycustomerid(receivecustomerid).then((data) => {
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
    this.receiveapi.getfukuanaccount(bankcardid).then((data) => {
      this.model['fukuanaccount'] = data['fukuanaccount'];
      this.model['branch'] = data['branch'];
    });
  }

  getcardno1(bankcardid) {
    this.receiveapi.getfukuanaccount(bankcardid).then((data) => {
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
    this.receiveapi.createbankaccount(this.bank).then(() => {
      this.hidecreateModal();
      this.toast.pop('success', '付款账户创建成功');
      // 执行刷新
      this.receiveapi.findbycustomerid(this.route.params['value']['customerid']).then((data) => {
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
      this.zhiyajinApi.updatezhiyajin(this.model['id'], this.model).then((model) => {
        this.toast.pop('success', '保存成功');
        this.get();
      });
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
      this.zhiyajinApi.submitverify(this.model['id'], this.model).then((model) => {
        console.log(model);
        this.toast.pop('success', '提交成功');
        this.router.navigateByUrl('zhiyajin');
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
      this.zhiyajinApi.auditzhiyajin(this.model['id'], this.model['kuaijikemu']).then((model) => {
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
      this.zhiyajinApi.refusezhiyajin(this.model['id']).then((model) => {
        this.toast.pop('success', '拒审成功');
        this.router.navigateByUrl('zhiyajin');
      });
    }
  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  // 退职押金
  tuizhiyajin(id) {
    if (confirm('你确定退还质押金吗？')) {
      this.zhiyajinApi.tuizhiyajin(this.model['id']).then((model) => {
        this.toast.pop('success', '拒审成功');
        this.router.navigateByUrl('receive');
      });
    }
  }
  // 质押金冲抵欠款
  zhiyajintoqiankuan(id) {
    if (confirm('你确定质押金冲抵欠款吗？')) {
      this.zhiyajinApi.zhiyajintoqiankuan(this.model['id']).then((model) => {
        this.toast.pop('success', '拒审成功');
        this.router.navigateByUrl('receive');
      });
    }
  }

}
