import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cgfukuandet',
  templateUrl: './cgfukuandet.component.html',
  styleUrls: ['./cgfukuandet.component.scss']
})
export class CgfukuandetComponent implements OnInit {

  @ViewChild('classModal') private classModal: ModalDirective;
  banks: Array<any>;
  buyer: any;
  model: object = { id: '', bankid: null, account: null };
  flag: object = { tijiao: false, shenhe: false, fukuan: false, fuhe: false };
  fukuanModel: any = { org: {}, paycustomer: {}, vuser: {}, shoucustomer: {}, payuser: {}, fuheuser: {} };
  beizhu: any;
  modify = { id: '', beizhu: '' };
  constructor(private numberpipe: DecimalPipe, private caigouApi: CaigouService, private toast: ToasterService,
    private route: ActivatedRoute, private router: Router) {
    this.getcgfukuan();
  }

  ngOnInit() {
  }
  getcgfukuan() {
    this.flag = { tijiao: false, shenhe: false, fukuan: false, fuhe: false };
    this.caigouApi.cgfukuan(this.route.params['value']['id']).then(data => {
      console.log('xxx', data);
      this.fukuanModel = data.fukuanModel;
      this.fukuanModel['bigjine'] = data.bigjine;
      this.fukuanModel['jine'] = this.numberpipe.transform(this.fukuanModel['jine'], '1.2-2');
      if (this.fukuanModel.status === 0) {
        this.flag['tijiao'] = true;
      } else if (this.fukuanModel.status === 1) {
        this.flag['shenhe'] = true;
      } else if (this.fukuanModel.status === 2) {
        this.flag['fukuan'] = true;
      } else if (this.fukuanModel.status === 4) {
        this.flag['fuhe'] = true;
      }
      this.beizhu = data['beizhu'];
    });
  }
  coles() {
    this.classModal.hide();
  }
  submit() {
    if (confirm('确认要提交审核吗？')) {
      this.caigouApi.submitfk(this.fukuanModel.id).then(data => {
        this.toast.pop('success', '提交成功！', '');
        this.getcgfukuan();
      });
    }
  }
  verify() {
    if (confirm('确认要审核吗？')) {
      this.caigouApi.verifyfk(this.fukuanModel.id).then(data => {
        this.toast.pop('success', '审核成功！', '');
        this.getcgfukuan();
      });
    }
  }
  openbank() {
    this.model = { id: '', bankid: null, account: null };
    this.getbank(this.fukuanModel.paycustomerid);
    this.model['id'] = this.route.params['value']['id'];
    this.classModal.show();
  }
  // 获取银行
  getbank(value) {
    this.banks = [{ value: '', label: '全部' }];
    this.caigouApi.findbycustomerid(value).then(data => {
      data.forEach(bank => {
        this.banks.push({
          value: bank['id'],
          label: bank['bank']
        });
      });
    });
  }
  // 获取账号
  getaccount(event) {
    this.caigouApi.findaccount(event.value).then(data => {
      this.model['account'] = data['fukuanaccount'];
    });
  }
  fukuan() {
    console.log('bb', this.model);
    if (this.fukuanModel['jiesuantype'] === 3 && !this.buyer) {
      this.toast.pop('warning', '请选择承兑客户！', '');
      return;
    }
    if (this.buyer) {
      this.model['chengduikehuid'] = this.buyer['code'];
    }
    if (this.model['bankid'] === null) {
      this.toast.pop('warning', '请选择付款银行再付款！', '');
      return;
    }
    console.log(this.model);
    if (confirm('确认要付款吗？')) {
      this.toast.pop('success', '正在生成回执单，等待几秒......');
      this.caigouApi.fukuan(this.model).then(data => {
        this.toast.pop('success', '付款成功！', '');
        this.getcgfukuan();
        this.classModal.hide();
      });
    }
  }
  reload() {
    this.caigouApi.reloadprint(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', data.msg);
    });
  }
  print() {
    this.caigouApi.fukuanprint(this.route.params['value']['id']).then(data => {
      // this.toast.pop('success',data.msg);
      if (!data.flag) {
        this.toast.pop('warning', data.msg);
      } else {
        window.open(data.msg);
      }
    });
  }
  delete() {
    if (confirm('确认要删除吗？')) {
      this.caigouApi.deletecgfk(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '付款单删除成功！', '');
        this.router.navigate(['cgfukuan']);
      });
    }
  }
  fuhe() {
    if (confirm('确认要复核吗？')) {
      this.caigouApi.fuhe(this.fukuanModel.id).then(data => {
        this.toast.pop('success', '复核成功！', '');
        this.getcgfukuan();
      });
    }
  }
  back() {
    if (confirm('确认要回退吗？')) {
      this.caigouApi.backfukuan(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '回退成功');
        this.getcgfukuan();
      });
    }
  }
  refuse() {
    if (confirm('确认要弃审吗？')) {
      this.caigouApi.refusefukuan(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '弃审成功');
        this.getcgfukuan();
      });
    }
  }
  modifybeizhu() {
    if (this.beizhu !== this.fukuanModel['beizhu']) {
      this.modify['id'] = this.route.params['value']['id'];
      this.modify['beizhu'] = this.fukuanModel['beizhu'];
      console.log('beizhu', this.modify);
      this.caigouApi.fkmodifybeizhu(this.modify).then(data => {
        this.toast.pop('success', '备注修改成功');
        this.getcgfukuan();
      });
    }
  }
}
