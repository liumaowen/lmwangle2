import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { CustomerapiService } from '../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoukuanreport',
  templateUrl: './innertransferreport.component.html',
  styleUrls: ['./innertransferreport.component.scss']
})
export class InnertransferreportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  start = new Date();
  maxDate = new Date();
  end: Date;
  skstart: Date;
  skend: Date;
  orgs = [];
  sellersResult = [];
  companys;
  cuser;
  requestparams = { start: this.datepipe.transform(this.start, 'y-MM-dd'), end: '', skstart: '', skend: '', paycustomerid: '', skcustomerid: '',  cuserid: '' };
  model: any = {};
  gridOptions: GridOptions;
  wiskind: any = [];
  fubankaccounts: any = [];
  receivebankaccounts: any = [];
  endmax = new Date();
  actualdatetime: any = new Date();
  types: any = [{label: '请选择收款类型', value: ''}, {label: '转账', value: 1}, {label: '收款', value: 2}, {label: '退款', value: 3}];
  constructor(
    public settings: SettingsService,
    private datepipe: DatePipe,
    private customerApi: CustomerapiService,
    private receiveApi: ReceiveapiService,
    private toast: ToasterService,
    private router: Router) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/innertransfer/' + params.data.id + '">' + params.data.billno + '</a>';
          }else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款时间', field: 'actualdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款公司', field: 'pcustomername', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款银行', field: 'paybankname', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款账号', field: 'payaccount', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款公司', field: 'skcustomername', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款银行', field: 'skbankname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款账号', field: 'skaccount', width: 120 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款类型', field: 'type', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否生成收款凭证', field: 'isspz', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否生成付款凭证', field: 'isppz', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 90 }
    ];
  }

  ngOnInit() {
  }

  listDetail() {
    this.receiveApi.neibudetail(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };

  items = [{ value: '', label: '全部' }, { value: 1, label: '线上' }, { value: 0, label: '线下' }]
  openQueryDialog() {
    this.selectNull();
    this.customerApi.findwiskind().then((response) => {
      let selllist = [{ value: '', label: '全部' }];
      response.forEach(element => {
        selllist.push({
          label: element.name,
          value: element.id
        })
      });
      this.sellersResult = selllist;
    });
    this.showclassicModal();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = { start: this.datepipe.transform(this.start, 'y-MM-dd'), end: '', skstart: '', skend: '', paycustomerid: '', skcustomerid: '', cuserid: '', };
    this.end = null;
    this.skstart = null;
    this.skend = null;
    this.companys = undefined;
    this.cuser = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.skstart) {
      this.requestparams.skstart = this.datepipe.transform(this.skstart, 'y-MM-dd');
    }
    if (this.skend) {
      this.requestparams.skend = this.datepipe.transform(this.skend, 'y-MM-dd');
    }
    if (typeof (this.cuser) === 'object') { // 制单人
      this.requestparams['cuserid'] = this.cuser['code'];
    }
    if (!this.requestparams.start) {
      this.toast.pop('warnig', '开始时间必填！');
    } else {
      this.listDetail();
      this.hideclassicModal();
    }
  }

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '收款明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  /**创建弹窗 */
  add() {
    this.model = {};
    this.fubankaccounts = [];
    this.receivebankaccounts = [];
    this.getwiskind();
    this.addModal.show();
  }
  addcoles() {
    this.addModal.hide();
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
  getbank(receivecustomerid, flag) {
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
      } else {
        this.fubankaccounts = lslists;
      }
    });
  }
  // 银行卡号
  getcardno(bankcardid, flag) {
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
  addselectNull() {
    this.model = {};
    this.fubankaccounts = [];
    this.receivebankaccounts = [];
    this.getwiskind();
  }
  addshoukuan() {
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
    if (this.model['jine']) {
      const jine = this.model['jine'];
      const str = jine.match(/^-?\d+(\.\d{1,2})?$/);
      if (str) {
        if (confirm('确定创建吗？')) {
          this.addcoles();
          this.receiveApi.createneibu(this.model).then(model => {
            this.router.navigate(['innertransfer', model['id']]);
          });
        }
      } else {
        this.toast.pop('warning', '金额只允许保留两位小数！！！');
      }
    }
  }
}
