import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';

@Component({
  selector: 'app-shoukuanhuizong',
  templateUrl: './shoukuanhuizong.component.html',
  styleUrls: ['./shoukuanhuizong.component.scss']
})
export class ShoukuanhuizongComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('exceptShoukuanModal') private exceptShoukuanModal: ModalDirective;

  start = new Date();

  maxDate = new Date();

  end: Date;

  params = {};

  requestparams = {};

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private datepipe: DatePipe,
    private shoukuanApi: ReceiveapiService, private toast: ToasterService) {

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
      { cellStyle: { 'text-align': 'center' }, headerName: '板块', field: 'orgtype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '上月可用余额', field: 'prevmonthyue', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['prevmonthyue']) {
            return Number(params.data['prevmonthyue']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '本月预计回款', field: 'exceptshoukuanjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['exceptshoukuanjine']) {
            return Number(params.data['exceptshoukuanjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '本月已回款', field: 'shoukuanjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shoukuanjine']) {
            return Number(params.data['shoukuanjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预计再回款', field: 'noshoukuanjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['noshoukuanjine']) {
            return Number(params.data['noshoukuanjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '本月付款计划', field: 'fukuanplanjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fukuanplanjine']) {
            return Number(params.data['fukuanplanjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已完成付款', field: 'fukuanpayjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fukuanpayjine']) {
            return Number(params.data['fukuanpayjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '本月仍需付款', field: 'nofukuanpayjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['nofukuanpayjine']) {
            return Number(params.data['nofukuanpayjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '机构自有资金', field: 'orgjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['orgjine']) {
            return Number(params.data['orgjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '其它金额', field: 'otherjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['otherjine']) {
            return Number(params.data['otherjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '账面资金', field: 'bookjine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['bookjine']) {
            return Number(params.data['bookjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
    ];


  }

  ngOnInit() {
  }

  listDetail() {
    this.shoukuanApi.getOrgShoukuanJine(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };


  orgs = [];

  sellersResult = [];

  items = [{ value: '', label: '全部' }, { value: 1, label: '线上' }, { value: 0, label: '线下' }]
  openQueryDialog() {
    this.requestparams = {};
    this.showclassicModal();
  }

  // 查询
  query() {
    this.listDetail();
    this.hideclassicModal();
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
      fileName: '资金总体情况表.xls',
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

  // 预计回款
  showExceptShoukuanModal() {
    this.params = {};
    this.exceptShoukuanModal.show();
  }

  closeExceptShoukuanModal() {
    this.exceptShoukuanModal.hide();
  }

  addExceptShoukuan() {
    if (!this.params['month']) {
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    if (!this.params['orgtype']) {
      this.toast.pop('warning', '请选择板块类型！！！');
      return;
    }
    this.shoukuanApi.createExceptShoukuan(this.params).then((response) => {
      if (response) {
        this.closeExceptShoukuanModal();
        this.listDetail();
      }
    });
  }

  selectmonth(value) {
    let month = this.datepipe.transform(value, 'y-MM-dd');
    this.params['month'] = month;
    this.requestparams['month'] = month;
  }

}
