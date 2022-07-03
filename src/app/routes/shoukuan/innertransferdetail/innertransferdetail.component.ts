import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-innertransferdetail',
  templateUrl: './innertransferdetail.component.html',
  styleUrls: ['./innertransferdetail.component.scss']
})
export class InnertransferdetailComponent implements OnInit {
  model: any = { paycustomer: {}, org: {}, kuaijikemu: null,skcustomer: {} };
  endmax = new Date();
  actualdatetime;
  status = '';
  wiskind: any = [];
  fubankaccounts: any = [];
  receivebankaccounts: any = [];
  types: any = [{label: '请选择收款类型', value: ''}, {label: '转账', value: 1}, {label: '收款', value: 2}, {label: '退款', value: 3}];
  constructor(private route: ActivatedRoute,
    private receiveApi: ReceiveapiService,
    private toast: ToasterService,
    private router: Router,
    private customerApi: CustomerapiService,
    private datepipe: DatePipe,) {
      this.getwiskind();
    }
  ngOnInit() {
    this.get();
  }

  // 获取收款登记单
  get() {
    this.receiveApi.getneibuone(this.route.params['value']['id']).then((data) => {
      this.model = data;
      if(this.model['status'] === 1){
        this.status = '制单中';
      }else if(this.model['status'] === 2){
        this.status = '处理中';
      }else if(this.model['status'] === 3){
        this.status = '已核收';
      }
      if (this.model['actualdate']) {
        this.actualdatetime = new Date(this.model['actualdate']);
      }
      this.getbank(this.model['paycustomerid'], 0, 1);
      this.getbank(this.model['skcustomerid'], 1, 1);
      this.getcardno(this.model['paybankid'], 0);
      this.getcardno(this.model['skbankid'], 1);
    });
  }

  // 提交审核
  submitverify() {
    if (this.model['status'] === 3) {
      this.toast.pop('warning', '审核后不能提交！');
      return;
    }
    if (confirm('确定要提交审核吗？')) {
      this.receiveApi.submitverifyneibu(this.model['id'], this.model).then((model) => {
        this.toast.pop('success', '提交成功');
        this.get();
      });
    }
  }
  del() {
    if (this.model['isppz'] || this.model['isspz']) {
      this.toast.pop('warning', '已生成凭证不允许删除！');
      return;
    }
    if (confirm('确定要删除吗？')) {
      this.receiveApi.deleteneibu(this.model['id']).then((model) => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('innertransfer');
      });
    }
  }
  /**获取内部公司 */
  getwiskind() {
    this.customerApi.findwiskind().then((data) => {
      const lslists = [{ label: '请选择公司', value: '' }];
      data.forEach(element => {
        lslists.push({
          label: element.name,
          value: element.id
        });
      });
      this.wiskind = lslists;
    });
  }
  /**获取银行 */
  getbank(receivecustomerid, flag, isdel?) {
    if (!receivecustomerid) {
      return;
    }
    this.receiveApi.findbycustomerid(receivecustomerid).then((data) => {
      const lslists = [{ label: '请选择收款银行', value: '' }];
      data.forEach(element => {
        lslists.push({
          label: element.bank,
          value: element.id
        });
      });
      if (flag) {
        this.receivebankaccounts = lslists;
        if (!isdel) {
          delete this.model['skbankid'];
        }
      } else {
        this.fubankaccounts = lslists;
        if (!isdel) {
          delete this.model['paybankid'];
        }
      }
    });
  }
  // 银行卡号
  getcardno(bankcardid, flag, isdel?) {
    if (!bankcardid) {
      return;
    }
    this.receiveApi.getfukuanaccount(bankcardid).then((data) => {
      if (flag) {
        this.model['skaccount'] = data['fukuanaccount'];
      } else {
        this.model['payaccount'] = data['fukuanaccount'];
      }
    });
  }
  /**修改 */
  update() {
    if (this.model['status'] === 3) {
      this.toast.pop('warning', '审核后不允许修改！');
      return;
    }
    if (!this.model['type']) {
      this.toast.pop('warning', '请选择收款类型！！！');
      return;
    }
    if (!this.model['paycustomerid']) {
      this.toast.pop('warning', '请选择付款公司！！！');
      return;
    }
    if (!this.model['paybankid']) {
      this.toast.pop('warning', '请选择付款银行！！！');
      return;
    }
    if (!this.model['jine']) {
      this.toast.pop('warning', '请输入金额！！！');
      return;
    }
    if (!this.model['skcustomerid']) {
      this.toast.pop('warning', '请选择收款公司！！！');
      return;
    }
    if (!this.model['skbankid']) {
      this.toast.pop('warning', '请选择收款银行！！！');
      return;
    }
    this.model['actualdate'] = this.datepipe.transform(this.actualdatetime, 'yyyy-MM-dd');
    this.receiveApi.updateneibu(this.model).then(data => {
      this.get();
    });
  }
}
