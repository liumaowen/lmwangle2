import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { CustomerapiService } from './../../customer/customerapi.service';
import { FeeapiService } from './../feeapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feefukuandet',
  templateUrl: './feefukuandet.component.html',
  styleUrls: ['./feefukuandet.component.scss']
})
export class FeefukuandetComponent implements OnInit {

  start = new Date();
  ststart = new Date();

  maxDate = new Date();

  end: Date;
  stend: Date;

  requestparams = {
    cuserid: '',
    feecustomerid: '',
    paycustomerid: '',
    type: '',
    billtype: '',
    accountdirection: '',
    payorreceive: '',
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '',
    orgid: '',
    ststart: '',
    stend: ''
  };
  gridOptions: GridOptions;

  companyOfCode;

  cuser;

  types = [{ label: '全部', value: '' },
  { label: '汽运费', value: '1' },
  { label: '铁运费', value: '2' },
  { label: '船运费', value: '3' },
  { label: '出库费', value: '4' },
  { label: '开平费', value: '5' },
  { label: '纵剪费', value: '6' },
  { label: '销售运杂费', value: '7' },
  { label: '包装费', value: '8' },
  { label: '仓储费', value: '9' }]; // 定义费用类型

  billtypes = [{ label: '全部', value: '' },
  { label: '提货单', value: '提货单' },
  { label: '调拨单', value: '调拨单' }]; // 单据类型

  accountdirections = [{ label: '全部', value: '' },
  { label: '采购', value: '1' },
  { label: '销售', value: '2' }];

  payorreceives = [{ label: '全部', value: '' },
  { label: '应付', value: '1' },
  { label: '应收', value: '2' }];

  paycustomers = [];

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private feeApi: FeeapiService,
    private customerApi: CustomerapiService,
    private toast: ToasterService) {
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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款单单号', field: 'billno', width: 70,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/feefukuan/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.cdate, 'y-MM-dd');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.vdate, 'y-MM-dd');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '复核日期', field: 'checkdate', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.checkdate, 'y-MM-dd');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款日期', field: 'paydate', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.paydate, 'y-MM-dd');
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP登记的费用单位', field: 'feecustomername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际收款单位', field: 'actualfeecustomername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际收款人', field: 'actrcustomername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际收款银行', field: 'actualbank', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际收款账号', field: 'actualbaccount', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'orgname', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'types', width: 120 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '本次应付金额', field: 'benyingfu', width: 120 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '本次实付金额（含税）', field: 'benshifu', width: 120 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '处理金额', field: 'chuliyue', width: 70 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票税率', field: 'taxrate', width: 70 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '本次实付不含税金额', field: 'shifunorate', width: 70 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '本次实付税金', field: 'shifushuijin', width: 70 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '税率差异', field: 'shuilvchayi', width: 70 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '本次应付不含税金额', field: 'qitayingfu', width: 100 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '营业外收入不再支付部分（不含税）', field: 'yywnopayjine', width: 120 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '营业外收入不再支付部分（部门）', field: 'yywnopayorgname', width: 80 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP付款单位', field: 'paycustomername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票付款单位', field: 'fapiaopaycustomername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款银行', field: 'paybank', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款账号', field: 'paybaccount', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '复核人', field: 'checkusername', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款人', field: 'payusername', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'fapiaono', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '支付方式', field: 'paytype', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '会计科目', field: 'paycode', width: 70 },

      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否到票', field: 'isdaopiao', width: 70,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isdaopiao ? '是' : '否';
          } else {
            return null;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '预计到票日期', field: 'yujifapiao', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.yujifapiao, 'y-MM-dd');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实际到票日期', field: 'shijifapiao', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datePipe.transform(params.data.shijifapiao, 'y-MM-dd');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '付款类型', field: 'fukuantype', width: 70,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.fukuantype ? '提前' : '正常';
          } else {
            return null;
          }
        }
      }

    ];

  }

  ngOnInit() {
    //this.listDetail();
  }

  listDetail() {
    this.feeApi.feefukuandet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

  openQueryDialog() {
    this.selectNull();
    this.customerApi.findwiskind().then((data) => {
      const paycustomerlist = [{ label: '全部', value: '' }];
      data.forEach(element => {
        paycustomerlist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.paycustomers = paycustomerlist;
    });
    this.showclassicModal();
  }

  selectNull() {
    this.requestparams = {
      cuserid: '',
      feecustomerid: '',
      paycustomerid: '',
      type: '',
      billtype: '',
      accountdirection: '',
      payorreceive: '',
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '',
      orgid: '',
      ststart: '',
      stend: '',
    };

    this.companyOfCode = undefined;

    this.cuser = undefined;
    this.end = undefined;
    this.stend = undefined;
    this.start = new Date();
    this.ststart = undefined;
  }

  // 查询提货单
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (this.ststart) {
        this.requestparams.ststart = this.datePipe.transform(this.ststart, 'yyyy-MM-dd');
      } else {
        this.requestparams.ststart = '';
      }
      if (this.stend) {
        this.requestparams.stend = this.datePipe.transform(this.stend, 'yyyy-MM-dd');
      } else {
        this.requestparams.stend = '';
      }
      if (typeof (this.cuser) === 'object') {
        this.requestparams.cuserid = this.cuser['code'];
      } else {
        this.requestparams.cuserid = '';
      }
      if (typeof (this.companyOfCode) === 'object') {
        this.requestparams.feecustomerid = this.companyOfCode['code'];
      } else {
        this.requestparams.feecustomerid = '';
      }
      console.log(this.requestparams);
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  };

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '费用明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
