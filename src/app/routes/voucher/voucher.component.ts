import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { VoucherService } from './voucher.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  maxDate = new Date();
  /**
   * @param name 分类名称
   * @param url 接口
   */
  fenleis: any = [
    { flag: 1, name: '入库汇总-考核', url: 'rukuhzkaohe' },
    { flag: 2, name: '承兑贴息-考核', url: 'rukucdkaohe' },
    { flag: 3, name: '采购发票-涉税', url: 'caigousheshui' },
    { flag: 4, name: '销售收款-考核', url: 'shoukuankaohe' },
    { flag: 4, name: '销售付款-考核', url: 'xsfukuankaohe' },
    { flag: 5, name: '销售收款-涉税', url: 'shoukuansheshui' },
    { flag: 5, name: '销售退款-涉税', url: 'salerefundsheshui' },
    { flag: 5, name: '销售收款-承兑涉税', url: 'shoukuanchengduisheshui' },
    { flag: 6, name: '采购付款-考核', url: 'cgfukuankaohe' },
    { flag: 7, name: '采购付款-涉税', url: 'cgfukuansheshui' },
    { flag: 7, name: '采购付款-承兑涉税', url: 'cgfukuanchengduisheshui' },
    { flag: 8, name: '费用付款-考核', url: 'feefukuankaohe' },
    { flag: 9, name: '费用付款-涉税', url: 'feefukuansheshui' },
    { flag: 15, name: '费用付款-现金流', url: 'feefukuancashflow' },
    { flag: 10, name: '费用计提-考核', url: 'feejitikaohe' },
    { flag: 11, name: '费用计提-涉税', url: 'feejitisheshui' },
    { flag: 12, name: '销售货物-考核', url: 'xsKaoheNC' },
    { flag: 13, name: '销售货物-涉税', url: 'xsKaoheSheshuiNC' },
    { flag: 16, name: '销售运杂费冲抵当月-考核', url: 'xsfeeNckaohe' },
    { flag: 17, name: '每刻报银行存款-考核', url: 'bankcunNckaohe' },
    { flag: 18, name: '每刻报其他应收款（社保和公积金）-考核', url: 'gjjandsbNckaohe' },
    { flag: 19, name: '每刻报库存现金-考核', url: 'cashkaohe' },
    { flag: 20, name: '每刻报职工公用借款-考核', url: 'workerloankaohe' },
    { flag: 14, name: '每刻报自定义数据-考核', url: 'costomkaohe' },
    { flag: 21, name: '每刻报银行存款-涉税', url: 'bankcunNcSheshui' },
    { flag: 22, name: '每刻报库存现金-涉税', url: 'cashtax' },
    { flag: 14, name: '每刻报核销借款-涉税', url: 'loantax' },
    { flag: 14, name: '提前开票-涉税', url: 'advanceinvoicenc' },
    { flag: 14, name: '内部转账-涉税', url: 'innertransfernc' },
    { flag: 14, name: '内部转账-考核', url: 'innertransferkhnc' },
    { flag: 14, name: '财务费用报销-考核', url: 'financefeekhnc' },
    { flag: 14, name: '财务费用报销-涉税', url: 'financefeessnc' },
    { flag: 14, name: '借款单-考核', url: 'loankaohevoucher' },
    { flag: 14, name: '内部采购发票卖方-涉税', url: 'neicaigoufapiaosellernc' },
    { flag: 14, name: '内部采购发票买方-涉税', url: 'neicaigoufapiaobuyernc' },

  ];
  selectedData: any = {};
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();

  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  // 查询条件对象
  search = { start: '', end: '' };
  constructor(private datepipe: DatePipe,
    private service: VoucherService) {
  }

  ngOnInit() {
  }
  /**确定 */
  confirm() {
    this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search['end'] = this.datepipe.transform(new Date(this.end.getFullYear(),
      this.end.getMonth(), this.end.getDate() + 1), 'y-MM-dd');
    this.service.voucherUrl(this.selectedData['url'], this.search).then(data => {
    });
    this.closeclassicmodal();
  }
  /**打开弹窗 */
  showDialog(data) {
    this.selectedData = data;
    this.search = { start: '', end: '' };
    this.classicModel.show();
  }
  closeclassicmodal() {
    this.classicModel.hide();
  }
}
