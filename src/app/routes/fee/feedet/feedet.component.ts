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
  selector: 'app-feedet',
  templateUrl: './feedet.component.html',
  styleUrls: ['./feedet.component.scss']
})
export class FeedetComponent implements OnInit {

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
    stend: '',
    includechengben: ''
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
  chengbens = [{ label: '全部', value: '' },
  { label: '是', value: true },
  { label: '否', value: false }];

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
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'feeid', width: 70,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.billtype === '提货单') {
              return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '调拨单') {
              return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '销售退货单') {
              return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else {
              return params.data.feeid;
            }
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'types', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否审核', field: 'isv', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', width: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'perprice', width: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 70, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务单位', field: 'buyname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付费单位', field: 'payname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 75,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计入个别计价成本表的日期', field: 'inchengbendate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'kucunid', field: 'kucunid', width: 75 }
    ];

  }

  ngOnInit() {
  }

  listDetail() {
    this.feeApi.feedet(this.requestparams).then((response) => {
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
      includechengben: ''
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
